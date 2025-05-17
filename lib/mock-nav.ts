const getTimestamp = () => {
  return new Date().toLocaleString("en-US", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Mock navigation data

export const getNavigationData = async () => {
  return {
    items: [
      {
        title: "Products",
        dropdown: {
          title: "Our Products",
          items: [
            {
              title: `Product 1 ${getTimestamp()}`,
              href: "/product-1",
            },
            {
              title: `Product 2 ${getTimestamp()}`,
              href: "/product-2",
            },
            {
              title: `Product 3 ${getTimestamp()}`,
              href: "/product-3",
            },
          ],
        },
      },
    ],
  };
};
