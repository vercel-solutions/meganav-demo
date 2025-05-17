// Mock navigation data
export const mockNavigationData = {
  header: {
    logo: "MegaNav",
    items: [
      {
        title: "Products",
        dropdown: {
          title: "Our Products",
          items: [
            {
              title: `Product 1 ${new Date().toISOString()}`,
              href: "/product-1",
            },
            {
              title: `Product 2 ${new Date().toISOString()}`,
              href: "/product-2",
            },
            {
              title: `Product 3 ${new Date().toISOString()}`,
              href: "/product-3",
            },
          ],
        },
      },
    ],
  },
};
