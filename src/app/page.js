import { redirect } from "next/navigation";

export default function Home() {
  redirect("/apotek/produk");
  return null;
}
