import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP, FaWhatsapp, FaLink } from "react-icons/fa";
import "./ImageCard.css";

  const ImageCard = ({ image, className = "" }) => {
  const imageSrc = image.thumbnail_path || image.image_path;
  const fullImageUrl = process.env.REACT_APP_API_URL + imageSrc;
  const shareUrl = `${window.location.origin}/images/${image.id}`;
  // const shareUrl = `${process.env.REACT_APP_API_URL}/images/${image.id}`;



  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "short", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };
 console.log(shareUrl);

  return (
    <Card className={`image-card ${className}`}>
      <Link to={`/images/${image.id}`} className="image-card-link">
        <div className="image-card-img-container">
          {/* Share Buttons */}
          <div className="image-card-share">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-icon"
              title="Share on Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-icon"
              title="Share on Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-icon"
              title="Share on LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a
              href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${fullImageUrl}&description=${image.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-icon"
              title="Share on Pinterest"
            >
              <FaPinterestP />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                image.title
              )}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-icon"
              title="Share on WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <button
              className="share-icon share-copy"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
              }}
              title="Copy link"
            >
              <FaLink />
            </button>
          </div>

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
