const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice)) {
      return numericPrice.toLocaleString();
    }
    return price;
};

export default formatPrice