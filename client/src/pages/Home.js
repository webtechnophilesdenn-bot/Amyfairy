import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/components/Footer";
import { resetUserError } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import DiwaliBanner from "../features/common/components/DiwaliBanner";
function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetUserError());
  }, [dispatch]);

  dispatch(resetUserError());
  return (
    <>
      <NavBar>
        <DiwaliBanner/>
        <ProductList></ProductList>
      </NavBar>
      <Footer></Footer>
    </>
  );
}

export default Home;