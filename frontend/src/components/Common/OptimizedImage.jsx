import { optimizeImageUrl } from "../../utils/optimizeImageUrl";

const OptimizedImage = ({
    src,
    alt,
    className = "",
    width = 800,
    quality = 70,
    eager = false,
    draggable = true,
}) => {
    const optimizedSrc = optimizeImageUrl(src, width, quality);

    return (
        <img
            src={optimizedSrc}
            alt={alt}
            className={className}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : "auto"}
            draggable={draggable}
        />
    );
};

export default OptimizedImage;
