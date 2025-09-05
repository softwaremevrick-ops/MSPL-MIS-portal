const ProjectReport = {
    list: async () => {
      console.log("Mock ProjectReport.list called");
      return [];
    },
    get: async (id) => {
      console.log(`Mock ProjectReport.get called with id: ${id}`);
      return null;
    },
    create: async (data) => {
      console.log("Mock ProjectReport.create called with data:", data);
      return data;
    },
    update: async (id, data) => {
      console.log(`Mock ProjectReport.update called with id: ${id}, data:`, data);
      return data;
    },
    delete: async (id) => {
      console.log(`Mock ProjectReport.delete called with id: ${id}`);
      return { message: 'Mock ProjectReport deleted' };
    },
  };
  
  export default ProjectReport;
