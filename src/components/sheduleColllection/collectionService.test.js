import axios from "axios";
import { toast } from "react-toastify";
import {
  fetchCollections,
  deleteCollection,
  scheduleCollection,
} from "./collectionService"; // Update the import path accordingly
import { API_BASE_URL } from "./constants";

jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Collection Service", () => {
  const token = "test-token";
  const collectionData = { name: "Test Collection" };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("fetchCollections", () => {
    it("should fetch collections successfully", async () => {
      const collections = [{ id: 1, name: "Collection 1" }];
      const collection = [{ id: 1, name: "Collection 1" }];
      axios.get.mockResolvedValueOnce({ data: collections });

      const result = await fetchCollections(token);

      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/collections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(result).toEqual(collection);
    });

    it("should handle error when fetching collections (generic error)", async () => {
      const errorMessage = "Some generic error occurred.";
      axios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchCollections(token)).rejects.toThrow(Error);
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to schedule collection. Please try again.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    });
  });

  describe("deleteCollection", () => {
    it("should delete a collection successfully", async () => {
      axios.delete.mockResolvedValueOnce({});

      await deleteCollection(1, token);

      expect(axios.delete).toHaveBeenCalledWith(
        `${API_BASE_URL}/collections/1`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Collection deleted successfully!",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    });

    it("should handle error when deleting a collection (generic error)", async () => {
      const errorMessage = "Some generic error occurred.";
      axios.delete.mockRejectedValueOnce(new Error(errorMessage));

      await expect(deleteCollection(1, token)).rejects.toThrow(Error);
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to schedule collection. Please try again.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    });
  });

  describe("scheduleCollection", () => {
    it("should schedule a collection successfully", async () => {
      const response = { data: { id: 1, ...collectionData } };
      axios.post.mockResolvedValueOnce(response);

      const response2 = { data: { id: 2, ...collectionData } };

      const result = await scheduleCollection(collectionData);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/collections`,
        collectionData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Collection scheduled successfully!",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      expect(result).toEqual(response);
    });

    it("should handle error when scheduling a collection (generic error)", async () => {
      const errorMessage = "Some generic error occurred.";
      axios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(scheduleCollection(collectionData)).rejects.toThrow(Error);
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to schedule collection. Please try again.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    });
  });
});
