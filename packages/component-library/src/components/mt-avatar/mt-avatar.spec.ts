import { render, screen } from "@testing-library/vue";
import MtAvatar from "./mt-avatar.vue";

describe("mt-avatar", () => {
  it("shows initials", () => {
    render(MtAvatar, { props: { firstName: "John", lastName: "Doe" } });

    const result = screen.getByTestId("mt-avatar-initials");

    expect(result).toBeInTheDocument();
    expect(result).toHaveTextContent("JD");
  });

  it("uses the display name for initials", () => {
    render(MtAvatar, { props: { name: "张三" } });

    expect(screen.getByTestId("mt-avatar-initials")).toHaveTextContent("张三");
  });
});
