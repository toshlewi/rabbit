export const optimizeImageUrl = (url, width = 800, quality = 70) => {
    if (!url || typeof url !== "string") {
        return url;
    }

    try {
        const imageUrl = new URL(url);
        const host = imageUrl.hostname;

        if (
            host.includes("images.unsplash.com") ||
            host.includes("unsplash.com")
        ) {
            imageUrl.searchParams.set("w", String(width));
            imageUrl.searchParams.set("q", String(quality));
            imageUrl.searchParams.set("auto", "format");
            imageUrl.searchParams.set("fit", "crop");
            imageUrl.searchParams.set("fm", "webp");
            return imageUrl.toString();
        }
    } catch {
        return url;
    }

    return url;
};
