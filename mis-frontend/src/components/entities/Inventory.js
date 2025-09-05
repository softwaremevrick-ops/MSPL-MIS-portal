const Inventory = {
    list: async () => {
      console.log("Mock Inventory.list called");
      return [];
    },
    get: async (id) => {
      console.log(`Mock Inventory.get called with id: ${id}`);
      return null;
    },
    create: async (data) => {
      console.log("Mock Inventory.create called with data:", data);
      return data;
    },
    update: async (id, data) => {
      console.log(`Mock Inventory.update called with id: ${id}, data:`, data);
      return data;
    },
    delete: async (id) => {
      console.log(`Mock Inventory.delete called with id: ${id}`);
      return { message: 'Mock Inventory deleted' };
    },
  };
  
  export default Inventory;
