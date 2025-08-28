import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP, FaWhatsapp, FaLink } from "react-icons/fa";
import "./ImageCard.css";

const ImageCard = ({ image, className = "" }) => {
  const imageSrc = image.thumbnail_path || image.image_path;
  const fullImageUrl = process.env.REACT_APP_API_URL + imageSrc;
  const shareUrl = `${window.location.origin}/images/${image.id}`;

  return (
    <Card className={`image-card ${className}`}>
      
      {/* Share Buttons OUTSIDE the Link */}
      <div className="image-card-share">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-icon"
          title="Share on Facebook"
          onClick={e => e.stopPropagation()}
        >
          <FaFacebookF />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-icon"
          title="Share on Twitter"
          onClick={e => e.stopPropagation()}
        >
          <FaTwitter />
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-icon"
          title="Share on LinkedIn"
          onClick={e => e.stopPropagation()}
        >
          <FaLinkedinIn />
        </a>
        <a
          href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(fullImageUrl)}&description=${encodeURIComponent(image.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-icon"
          title="Share on Pinterest"
          onClick={e => e.stopPropagation()}
        >
          <FaPinterestP />
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(image.title)}%20${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-icon"
          title="Share on WhatsApp"
          onClick={e => e.stopPropagation()}
        >
          <FaWhatsapp />
        </a>
        <button
          className="share-icon share-copy"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              navigator.clipboard.writeText(shareUrl);
              alert("Link copied to clipboard!");
            } catch (err) {
              alert("Failed to copy link.");
              console.error(err);
            }
          }}
          title="Copy link"
        >
          <FaLink />
        </button>
      </div>

      {/* Image and Overlay wrapped in Link */}
      <Link to={`/images/${image.id}`} className="image-card-link">
        <div className="image-card-img-container">
          <Card.Img
            variant="top"
            src={fullImageUrl}
            alt={image.title}
            className="image-card-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/placeholder.jpg";
            }}
          />
        </div>

        <div className="image-card-overlay">
          <p className="image-card-overlay-title">{image.title}</p>
          <div className="image-card-overlay-meta">
            {image.year && (
              <span className="image-card-year">{image.year}</span>
            )}
            {image.category_name && (
              <span className="image-card-category">{image.category_name}</span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ImageCard;
