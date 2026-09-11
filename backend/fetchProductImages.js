// fetchProductImages.js
//
// Fetches 2 relevant, high-quality Unsplash images per product.
// Searches specifically for African / Black / Kenyan fashion contexts.
//
// Output:
//   data/products.js
//
// Run:
//   node fetchProductImages.js
//
// Requires:
//   Node 18+
//   dotenv

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, ".env"),
  override: true,
});

const productBase = require("./data/productBase.js");

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) {
  console.error(
    "\nMissing UNSPLASH_ACCESS_KEY.\n" +
      "Make sure your backend .env contains:\n\n" +
      "UNSPLASH_ACCESS_KEY=your_new_access_key_here\n"
  );

  process.exit(1);
}

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| African fashion search context
|--------------------------------------------------------------------------
|
| Unsplash does not provide a reliable "African people only" filter.
| We therefore add African/Black/Kenyan fashion terms to the search.
|
*/

const AFRICAN_SEARCH_TERMS = [
  "African fashion",
  "African model",
  "Black model",
];

/*
|--------------------------------------------------------------------------
| Build multiple search queries
|--------------------------------------------------------------------------
*/

function buildQueries(searchQuery) {
  return [
    `${searchQuery} African model`,
    `${searchQuery} Black model`,
    `${searchQuery} African fashion`,
  ];
}

/*
|--------------------------------------------------------------------------
| Check whether a photo appears relevant to our intended context
|--------------------------------------------------------------------------
*/

function getSearchableText(photo) {
  const parts = [
    photo.alt_description,
    photo.description,
    photo.user?.name,
    photo.user?.username,
  ];

  if (Array.isArray(photo.tags)) {
    photo.tags.forEach((tag) => {
      if (typeof tag === "string") {
        parts.push(tag);
      } else if (tag?.title) {
        parts.push(tag.title);
      }
    });
  }

  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/*
|--------------------------------------------------------------------------
| Score an Unsplash result
|--------------------------------------------------------------------------
|
| Higher score = more likely to match African fashion requirements.
|
*/

function scorePhoto(photo, originalQuery) {
  const text = getSearchableText(photo);

  let score = 0;

  const strongTerms = [
    "african",
    "black model",
    "black woman",
    "black man",
    "black people",
    "kenyan",
    "kenya",
    "nairobi",
    "africa",
  ];

  const fashionTerms = [
    "fashion",
    "clothing",
    "outfit",
    "shirt",
    "dress",
    "jacket",
    "pants",
    "trousers",
    "jeans",
    "skirt",
    "blouse",
    "hoodie",
    "polo",
    "sweater",
    "model",
    "streetwear",
  ];

  strongTerms.forEach((term) => {
    if (text.includes(term)) {
      score += 10;
    }
  });

  fashionTerms.forEach((term) => {
    if (text.includes(term)) {
      score += 3;
    }
  });

  // Reward photos with descriptions.
  if (photo.alt_description) {
    score += 2;
  }

  if (photo.description) {
    score += 1;
  }

  // Popularity is only a small factor.
  score += Math.min((photo.likes || 0) / 100, 5);

  // Reward the actual product query terms.
  const queryWords = originalQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);

  queryWords.forEach((word) => {
    if (text.includes(word)) {
      score += 2;
    }
  });

  return score;
}

/*
|--------------------------------------------------------------------------
| Search Unsplash
|--------------------------------------------------------------------------
*/

async function searchUnsplash(query) {
  const url =
    "https://api.unsplash.com/search/photos" +
    `?query=${encodeURIComponent(query)}` +
    "&per_page=20" +
    "&orientation=portrait" +
    "&content_filter=high" +
    "&order_by=relevant";

  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
    },
  });

  if (!res.ok) {
    const body = await res.text();

    throw new Error(
      `Unsplash API ${res.status} for "${query}": ${body}`
    );
  }

  const data = await res.json();

  return data.results || [];
}

/*
|--------------------------------------------------------------------------
| Fetch best images for one product
|--------------------------------------------------------------------------
*/

async function searchImages(query, count = 2) {
  const queries = buildQueries(query);

  const allResults = [];

  for (const searchQuery of queries) {
    try {
      console.log(`\n    Searching: "${searchQuery}"`);

      const results = await searchUnsplash(searchQuery);

      allResults.push(...results);
    } catch (error) {
      console.log(
        `    Search failed for "${searchQuery}": ${error.message}`
      );
    }

    // Small pause between searches.
    await sleep(700);
  }

  /*
  |--------------------------------------------------------------------------
  | Remove duplicate Unsplash photos
  |--------------------------------------------------------------------------
  */

  const uniquePhotos = [];

  const seenIds = new Set();

  for (const photo of allResults) {
    if (!photo?.id) {
      continue;
    }

    if (seenIds.has(photo.id)) {
      continue;
    }

    if (!photo.urls?.raw) {
      continue;
    }

    seenIds.add(photo.id);
    uniquePhotos.push(photo);
  }

  /*
  |--------------------------------------------------------------------------
  | Score and sort results
  |--------------------------------------------------------------------------
  */

  const ranked = uniquePhotos
    .map((photo) => ({
      photo,
      score: scorePhoto(photo, query),
    }))
    .sort((a, b) => b.score - a.score);

  /*
  |--------------------------------------------------------------------------
  | Prefer results that actually contain African-related signals
  |--------------------------------------------------------------------------
  */

  const africanMatches = ranked.filter(({ photo }) => {
    const text = getSearchableText(photo);

    return [
      "african",
      "black model",
      "black woman",
      "black man",
      "black people",
      "kenyan",
      "kenya",
      "nairobi",
      "africa",
    ].some((term) => text.includes(term));
  });

  /*
  |--------------------------------------------------------------------------
  | Use African-context matches first.
  | If Unsplash doesn't expose enough metadata, fall back to ranked results.
  |--------------------------------------------------------------------------
  */

  const preferred =
    africanMatches.length >= count
      ? africanMatches
      : ranked;

  return preferred.slice(0, count).map(({ photo }) => ({
    url:
      `${photo.urls.raw}` +
      "&w=900&q=80&auto=format&fit=crop",

    altText:
      photo.alt_description ||
      photo.description ||
      `${query} African fashion`,

    photographer:
      photo.user?.name || "Unsplash",

    source:
      photo.links?.html ||
      "https://unsplash.com",
  }));
}

/*
|--------------------------------------------------------------------------
| Main
|--------------------------------------------------------------------------
*/

async function main() {
  const finished = [];
  const warnings = [];

  console.log("\n==============================================");
  console.log(" ToshWear African Fashion Image Fetcher");
  console.log("==============================================\n");

  console.log(
    `Products to process: ${productBase.length}\n`
  );

  for (let i = 0; i < productBase.length; i++) {
    const { searchQuery, ...product } = productBase[i];

    process.stdout.write(
      `[${i + 1}/${productBase.length}] ${product.name} ...`
    );

    try {
      const images = await searchImages(searchQuery, 2);

      if (images.length === 0) {
        warnings.push(
          `${product.name}: no suitable images found for "${searchQuery}"`
        );

        console.log(" NO IMAGES FOUND");
      } else if (images.length === 1) {
        warnings.push(
          `${product.name}: only 1 image found for "${searchQuery}"`
        );

        console.log(" 1 IMAGE");
      } else {
        console.log(` OK (${images.length} images)`);
      }

      finished.push({
        ...product,

        isPublished: true,

        isFeatured:
          i === 0 ||
          product.sku === "KE-TW-W-022",

        images: images.map(({ url, altText }) => ({
          url,
          altText,
        })),
      });
    } catch (err) {
      console.log(" FAILED");

      warnings.push(
        `${product.name}: ${err.message}`
      );

      finished.push({
        ...product,

        isPublished: true,

        isFeatured:
          i === 0 ||
          product.sku === "KE-TW-W-022",

        images: [],
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Wait before processing the next product.
    |--------------------------------------------------------------------------
    */

    await sleep(2000);
  }

  /*
  |--------------------------------------------------------------------------
  | Generate products.js
  |--------------------------------------------------------------------------
  */

  const header =
    "// Auto-generated by fetchProductImages.js on " +
    new Date().toISOString() +
    "\n" +
    "// Re-run the script any time to refresh images.\n\n";

  const body =
    "const products = " +
    JSON.stringify(finished, null, 2) +
    ";\n\n" +
    "module.exports = products;\n";

  const outPath = path.join(
    __dirname,
    "data",
    "products.js"
  );

  fs.writeFileSync(
    outPath,
    header + body,
    "utf8"
  );

  console.log("\n==============================================");
  console.log(" IMAGE FETCH COMPLETE");
  console.log("==============================================\n");

  console.log(
    `Wrote ${finished.length} products to:`
  );

  console.log(outPath);

  if (warnings.length) {
    console.log(
      `\n${warnings.length} warning(s):`
    );

    warnings.forEach((warning) => {
      console.log(`  - ${warning}`);
    });

    console.log(
      "\nProducts with missing images can be given broader search queries in productBase.js."
    );
  } else {
    console.log(
      "\nEvery product received 2 images."
    );
  }

  console.log(
    "\nNext step: run node seeder.js\n"
  );
}

/*
|--------------------------------------------------------------------------
| Run
|--------------------------------------------------------------------------
*/

main().catch((err) => {
  console.error("\nFatal error:", err);

  process.exit(1);
});