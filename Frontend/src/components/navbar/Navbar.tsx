import React, { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useGlobalState } from "../../context/GlobalStateContext";
import {
  Menu,
  MenuItem,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import { FaBars } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Navbar: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"sign-in" | "sign-up" | undefined>(
    undefined
  );
  const { user, setUser } = useGlobalState();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOptionSelect = (option: string) => {
    if (option === "profile") {
      navigate(`/profile/${user?.id}`);
    } else if (option === "myBookings") {
      navigate(`/dashboard`);
    } else if (option === "owner-pitches") {
      navigate(`pitches/${user?._id}`);
    } else if (option === "admin-profile") {
      navigate(`/admin-profile/${user?.id}`);
    } else if (option === "owner-dashboard") {
      navigate(`/owner-dashboard/${user?.id}`);
    } else if (option === "admin-dashboard") {
      navigate(`/admin-dashboard`);
    } else if (option === "logout") {
      setUser(null);
      localStorage.removeItem("token");
      navigate("/home");
    }
    handleMenuClose();
  };

  const openModal = (type: "sign-in" | "sign-up") => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      setUser(jwtDecode(localStorage.getItem("token") as string));
    }
  }, []);

  return (
    <nav className={styles.navbar}>
      {!user ? (
        <div className={`${styles.navbarButtons}`}>
          <button className={styles.noBtn} onClick={() => openModal("sign-in")}>
            تسجيل الدخول
          </button>
          <button className={styles.btn} onClick={() => openModal("sign-up")}>
            إنشاء حساب
          </button>
        </div>
      ) : (
        <div className={`${styles.userMenu} ${styles.userInfo}`}>
          <Button
            className={styles.userMenuBtn}
            onClick={handleMenuClick}
            endIcon={
              <MdKeyboardArrowDown
                className={`${styles.arrowIcon} ${
                  isMenuOpen ? styles.open : ""
                }`}
              />
            }
          >
            <span className={styles.username}>{user?.name}</span>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              style: {
                fontFamily: "Cairo",
                fontSize: "16px",
              },
            }}
          >
            {user &&
              user?.role == "user" && [
                <MenuItem
                  key="profile"
                  onClick={() => handleOptionSelect("profile")}
                  className={styles.menuItem}
                >
                  الملف الشخصي
                </MenuItem>,
                <MenuItem
                  key="myBookings"
                  onClick={() => handleOptionSelect("myBookings")}
                  className={styles.menuItem}
                >
                  حجوزاتي
                </MenuItem>,
              ]}
            {user?.role == "owner" && [
              <MenuItem
                key="owner-pitches"
                onClick={() => handleOptionSelect("owner-pitches")}
                className={styles.menuItem}
              >
                الملاعب الخاصة بي
              </MenuItem>,
              <MenuItem
                key="owner-dashboard"
                onClick={() => handleOptionSelect("owner-dashboard")}
                className={styles.menuItem}
              >
                لوحة التحكم
              </MenuItem>,
            ]}
            {user && user?.role === "admin" && (
              <MenuItem
                key="admin-dashboard"
                onClick={() => handleOptionSelect("admin-dashboard")}
                className={styles.menuItem}
              >
                لوحة التحكم
              </MenuItem>
            )}
            {user && (
              <MenuItem
                key="logout"
                onClick={() => handleOptionSelect("logout")}
                className={styles.lastMenuItem}
              >
                تسجيل الخروج
              </MenuItem>
            )}
          </Menu>
        </div>
      )}

      <div className={styles.hamburger}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
        >
          <FaBars />
        </IconButton>
      </div>
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{
          width: 200,
          "& .MuiDrawer-paper": {
            width: 200,
            backgroundColor: "#f5f5f5",
            padding: "20px 10px",
          },
        }}
      >
        <Link to="/home" className={styles.navbarLogoSidebar}>
          <img src="/src/assets/football.png" alt="logo" />

          <h1>
            دليل <span>الملاعب</span>
          </h1>
        </Link>

        <List>
          <ListItem
            component={Link}
            to="/home"
            onClick={toggleSidebar}
            sx={{
              padding: "12px 16px",
              color: "black",
              marginBottom: "8px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            الرئيسية
          </ListItem>
          <ListItem
            component={Link}
            to="/pitches"
            onClick={toggleSidebar}
            sx={{
              padding: "12px 16px",
              color: "black",
              marginBottom: "8px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            الملاعب
          </ListItem>
          <ListItem
            component={Link}
            to="/home#services"
            onClick={toggleSidebar}
            sx={{
              padding: "12px 16px",
              color: "black",
              marginBottom: "8px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            خدماتنا
          </ListItem>
          <ListItem
            component={Link}
            to="/home#contact-us"
            onClick={toggleSidebar}
            sx={{
              padding: "12px 16px",
              color: "black",
              marginBottom: "8px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            تواصل معنا
          </ListItem>
          {!user && (
            <>
              <ListItem
                onClick={() => {
                  openModal("sign-in");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <button
                  className={styles.noBtn}
                  onClick={() => openModal("sign-in")}
                  style={{ width: "100%", textAlign: "right" }}
                >
                  تسجيل الدخول
                </button>
              </ListItem>
              <ListItem
                onClick={() => {
                  openModal("sign-up");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <button
                  className={styles.btn}
                  onClick={() => openModal("sign-up")}
                  style={{ width: "100%", textAlign: "right" }}
                >
                  إنشاء حساب
                </button>
              </ListItem>
            </>
          )}
          {user?.role == "user" && (
            <>
              <ListItem
                onClick={() => {
                  handleOptionSelect("profile");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                الملف الشخصي
              </ListItem>
              <ListItem
                onClick={() => {
                  handleOptionSelect("myBookings");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                حجوزاتي
              </ListItem>
              <ListItem
                onClick={() => {
                  handleOptionSelect("logout");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <button
                  className={styles.signout}
                  style={{ width: "100%", textAlign: "right" }}
                >
                  تسجيل الخروج
                </button>
              </ListItem>
            </>
          )}
          {user?.role == "owner" && (
            <>
              <ListItem
                onClick={() => {
                  handleOptionSelect("admin-profile");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                تعديل الملعب
              </ListItem>
              <ListItem
                onClick={() => {
                  handleOptionSelect("owner-dashboard");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                لوحة التحكم
              </ListItem>
              <ListItem
                onClick={() => {
                  handleOptionSelect("logout");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <button
                  className={styles.signout}
                  style={{ width: "100%", textAlign: "right" }}
                >
                  تسجيل الخروج
                </button>
              </ListItem>
            </>
          )}

          {user?.role == "admin" && (
            <>
              <ListItem
                onClick={() => {
                  handleOptionSelect("admin-dashboard");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                لوحة التحكم
              </ListItem>
              <ListItem
                onClick={() => {
                  handleOptionSelect("logout");
                  toggleSidebar();
                }}
                sx={{
                  padding: "12px 16px",
                  color: "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <button
                  className={styles.signout}
                  style={{ width: "100%", textAlign: "right" }}
                >
                  تسجيل الخروج
                </button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Regular nav list */}
      <ul className={styles.navList}>
        <li className={styles.listItem}>
          <Link to="/home" className={styles.navLink}>
            الرئيسية
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link to="/pitches" className={styles.navLink}>
            الملاعب
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link to="/home#services" className={styles.navLink}>
            خدماتنا
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link to="/home#contact-us" className={styles.navLink}>
            تواصل معنا
          </Link>
        </li>
      </ul>

      <Link to="/home" className={styles.navbarLogo}>
        <h1>
          دليل <span>الملاعب</span>
        </h1>
        <img src="/src/assets/football.png" alt="logo" />
      </Link>

      <Modal showModal={showModal} closeModal={closeModal} type={modalType} />
    </nav>
  );
};

export default Navbar;
