import React from "react";

interface JsonLdProps {
  data: any;
}

/**
 * JsonLd component to inject Schema.org structured data into the page.
 */
const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;
