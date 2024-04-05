import { getPost } from "../services/posts";
import { handleReplyToPost } from "../services/reply";
import { connect } from "../utils/db";

connect();

describe("Simple test", () => {
  it("foo", async () => {
    // postId = 9
    // userId= 4 -- author vburdylev@twelvedevs.com
    // userId = 3 -- stranger vadim.burdylev@mail.ru

    const postId = 9;
    const userIdStranger = 3;

    const post = await getPost(postId, undefined);
    const result = await handleReplyToPost(userIdStranger, post!, 'hello world');

    expect(result).toBeTruthy();
  });
});
