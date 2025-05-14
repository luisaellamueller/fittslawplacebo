import axios from "axios";

class FlowHelper {
  static API_BASE_URL = "http://localhost:5001/api/flow";
  
  /**
   * Set a new Flow Page
   * @param {string} flow - The flow page to set
   */
  static async setFlowPage(flow) {
    if (!flow) throw new Error("Flow name is required");
    try {
      const response = await axios.post(`${this.API_BASE_URL}/setFlowPage`, { flow });
      console.log("Flow Page set successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error setting flow page:", error);
      throw error;
    }
  }
  
  /**
   * Get the current Flow Page
   */
  static async getFlowPage() {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/getFlowPage`);
      return response.data.flowPage;
    } catch (error) {
      console.error("Error fetching flow page:", error);
      throw error;
    }
  }
  
  /**
   * Set the Next Flow
   * @param {string} flow - The next flow to set
   */
  static async setNextFlow(flow) {
    if (!flow) throw new Error("Flow name is required");
    try {
      const response = await axios.post(`${this.API_BASE_URL}/setNextFlow`, { flow });
      console.log("Next Flow set successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error setting next flow:", error);
      throw error;
    }
  }
  
  /**
   * Get the Next Flow
   */
  static async getNextFlow() {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/getNextFlow`);
      return response.data.nextFlow;
    } catch (error) {
      console.error("Error fetching next flow:", error);
      throw error;
    }
  }
  
  /**
   * Add a flow name to the visited array
   * @param {string} flow - The flow name to add
   */
  static async setVisited(flow) {
    if (!flow) throw new Error("Flow name is required");
    try {
      const response = await axios.post(`${this.API_BASE_URL}/setVisited`, { flow });
      console.log("Flow name added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding flow name to visited:", error);
      throw error;
    }
  }
  
  /**
   * Check if a flow name has been visited
   * @param {string} flow - The flow name to check
   */
  static async checkVisited(flow) {
    if (!flow) throw new Error("Flow name is required");
    try {
      const response = await axios.post(`${this.API_BASE_URL}/checkVisited`, { flow });
      return response.data.exists;
    } catch (error) {
      console.error("Error checking visited flow:", error);
      throw error;
    }
  }
   
  /**
   * Get the size of the visited array
   * @returns {number} The size of the visited array
   */
  static async getVisitedSize() {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/getVisitedSize`);
      return response.data.visitedSize;
    } catch (error) {
      console.error("Error fetching visited size:", error);
      throw error;
    }
  }

  /**
   * Clear all visited flows
   * @returns {object} Response data with success message
   */
  static async clearVisited() {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/clearVisited`);
      console.log("Visited flows cleared successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error clearing visited flows:", error);
      throw error;
    }
  }
}

export default FlowHelper;