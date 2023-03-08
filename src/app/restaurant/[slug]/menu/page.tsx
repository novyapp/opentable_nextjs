import Menu from "../components/Menu";
import RestaurantNavbar from "../components/RestaurantNavbar";

export const metadata = {
  title: "Menu of - OpenTable",
};

export default function RestaurantMenu() {
  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavbar />
      <Menu />
    </div>
  );
}
