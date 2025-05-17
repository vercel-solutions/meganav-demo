// Mock navigation data
export const mockNavigationData = {
  items: [
    {
      title: "Products",
      dropdown: {
        title: "Our Products",
        items: [
          {
            title: `Product 1 ${new Date().toLocaleString("en-US", {
              weekday: "long",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}`,
            href: "/product-1",
          },
          {
            title: `Product 2 ${new Date().toLocaleString("en-US", {
              weekday: "long",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}`,
            href: "/product-2",
          },
          {
            title: `Product 3 ${new Date().toLocaleString("en-US", {
              weekday: "long",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}`,
            href: "/product-3",
          },
        ],
      },
    },
  ],
};
