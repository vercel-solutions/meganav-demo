import { mockNavigationData } from "./mock-data";

// Deep clone the initial data to avoid reference issues
const initialData = JSON.parse(JSON.stringify(mockNavigationData));

// In-memory store for navigation data
const navigationStore = {
  data: initialData,
  lastUpdated: new Date().toISOString(),
  version: 1, // Keep version tracking internally for cache invalidation
};

// Simulate external product data source
const externalProductData = [
  {
    id: 1,
    title: "Product 1",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Product 2",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Product 3",
    lastUpdated: new Date().toISOString(),
  },
];

export function getNavigationData() {
  return navigationStore.data;
}

export function updateNavigationData(newData: any) {
  navigationStore.data = newData;
  navigationStore.lastUpdated = new Date().toISOString();
  navigationStore.version += 1;
  return navigationStore;
}

// Function to simulate product update for demo purposes
export function simulateProductUpdate() {
  // Update a random product with timestamp and random descriptor
  const productIndex = Math.floor(Math.random() * externalProductData.length);
  const now = new Date();

  // Array of random descriptors to make each update visibly different
  const descriptors = [
    "New",
    "Updated",
    "Featured",
    "Hot",
    "Best Seller",
    "Limited Edition",
    "On Sale",
    "Premium",
    "Exclusive",
    "Trending",
  ];
  const randomDescriptor =
    descriptors[Math.floor(Math.random() * descriptors.length)];

  // Generate a random color to make updates more obvious
  const colors = ["Red", "Blue", "Green", "Black", "Purple", "Gold", "Silver"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Make the update more visible with timestamp, random descriptor and color
  externalProductData[productIndex] = {
    ...externalProductData[productIndex],
    title: `${randomColor} Product ${externalProductData[productIndex].id} (${randomDescriptor})`,
    lastUpdated: now.toISOString(),
  };

  // Also update the navigation store directly to ensure changes are visible
  const result = updateNavigationStore(
    productIndex,
    randomDescriptor,
    randomColor,
    now
  );

  return {
    ...externalProductData[productIndex],
    updateInfo: result,
  };
}

// Helper function to update navigation store directly for demo purposes
function updateNavigationStore(
  productIndex: number,
  descriptor: string,
  color: string,
  timestamp: Date
): { updated: boolean; message: string } {
  // Clone current data
  const currentData = JSON.parse(JSON.stringify(navigationStore.data));

  // Find the Products dropdown
  const productsItem = currentData.header.items.find(
    (item: any) => item.title === "Products"
  );

  if (
    productsItem &&
    productsItem.dropdown &&
    productsItem.dropdown.items &&
    productsItem.dropdown.items[productIndex]
  ) {
    // Format timestamp for display
    const formattedTime = `${timestamp
      .getHours()
      .toString()
      .padStart(2, "0")}:${timestamp
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${timestamp.getSeconds().toString().padStart(2, "0")}`;

    const oldTitle = productsItem.dropdown.items[productIndex].title;

    // Update the navigation item with new data
    productsItem.dropdown.items[productIndex] = {
      title: `⏱️ ${formattedTime} - ${color} Product ${
        productIndex + 1
      } (${descriptor})`,
      href: productsItem.dropdown.items[productIndex].href,
    };

    // Update the store
    updateNavigationData(currentData);

    return {
      updated: true,
      message: `Updated: "${oldTitle}" → "${productsItem.dropdown.items[productIndex].title}"`,
    };
  }

  return {
    updated: false,
    message: "No update performed - could not find product in navigation",
  };
}
