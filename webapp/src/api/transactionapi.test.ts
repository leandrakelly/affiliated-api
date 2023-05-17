import axios from "../api/axios";
import MockAdapter from "axios-mock-adapter";
import { getTransactions, uploadTransactions } from "./transactionApi";

const mockAxios = new MockAdapter(axios) as any;

mockAxios.onGet("/transaction").reply(200, {
  data: "mocked data",
});

mockAxios.onPost("transaction/upload").reply(500, {
  message: "Error occurred during upload",
});

describe("Your file", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test("getTransactions function should make a GET request and return data", async () => {
    const data = await getTransactions();

    expect(data.data).toEqual("mocked data");
    expect(mockAxios.history.get[0].headers.Authorization).toContain("Bearer");
  });

  test("uploadTransactions function should make a POST request with file data", async () => {
    const file = new File(["test file content"], "test.txt", {
      type: "text/plain",
    });

    mockAxios.onPost("transaction/upload").reply(500, {
      message: "Error occurred during upload",
    });

    await expect(uploadTransactions(file)).rejects.toThrow(
      "Error occurred during upload"
    );

    expect(mockAxios.history.post[0].headers.Authorization).toContain("Bearer");
    expect(mockAxios.history.post[0].headers["Content-Type"]).toContain(
      "multipart/form-data"
    );
    expect(mockAxios.history.post[0].data.get("file")).toEqual(file);
  });
});
