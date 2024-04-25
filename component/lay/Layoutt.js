import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Foot from "../foot";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import useAxiosAuth from "../../lib/hooks/useAxiosAuth";
import { getSession, signOut } from "next-auth/react";
import DocumentScannerSharpIcon from "@mui/icons-material/DocumentScannerSharp";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PhoneCallbackOutlinedIcon from "@mui/icons-material/PhoneCallbackOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SubjectIcon from "@mui/icons-material/Subject";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";

const drawerWidth = 240;

const Main = styled("div", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Sidebar({ children }) {
  const [user, setUser] = React.useState(false);
  const [admin, setAdmin] = React.useState(false);
  const [librarian, setLibrarian] = React.useState(false);

  React.useEffect(() => {
    const roles = async () => {
      const session = await getSession();
      const userRoles = session?.user.user.roles.map((role) => role.name);

      Object.entries(userRoles).forEach(([id, name]) => {
        if (name === "user") {
          setUser(true);
        } else if (name === "admin") {
          setAdmin(true);
        } else if (name === "librarian") {
          setLibrarian(true);
        }
      });
    };
    roles();
  }, []);

  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const axiosAuth = useAxiosAuth();

  const handleLogout = async () => {
    try {
      await axiosAuth.get("auth/logout"),
        {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        };
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      Swal.fire({
        text: "User not logged in",
        icon: "error",
      });
      console.error("Error logging out:", error);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open1, setOpen1] = React.useState(false);

  const handleClick = () => {
    setOpen1(!open1);
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { data: session } = useSession();
  const roles =
    session?.user.user.roles.map((role) => role.name.toLowerCase()) || [];

  const settings = ["Change Password", "Logout"];

  const handleMenuItemClick = (setting) => {
    handleCloseUserMenu();
    if (setting === "Change Password") {
      router.push("/auth/changepassword");
    } else if (setting === "Logout") {
      handleLogout();
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <div className="flex items-center  ">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-[20vw] h-[10vh]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg> */}
                {/* <img
                  width="48"
                  height="40"
                  src="../../logos.png"
                  alt="login form image"
                  className="m-2"
                /> */}
                <ImportContactsTwoToneIcon
                  className="w-20 mb-1 mr-4"
                  sx={{ fontSize: 50 }}
                />
                <h2 className="font-bold text-xl">Library Management System</h2>
              </div>
            </Typography>
            {librarian ? (
              <div className="p-4">
                <Link href="/scan">
                  <DocumentScannerSharpIcon sx={{ fontSize: 30 }} />
                </Link>
              </div>
            ) : null}
            {/* <AccountCircleIcon /> */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircleSharpIcon className="text-white" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleMenuItemClick(setting)}
                  >
                    {setting}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* <Button
              className="bg-sky-500 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 "
              color="inherit"
              onClick={handleLogout}
            >
              LogOut
            </Button> */}
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,

            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          {/* <div className="flex justify-center     ">
            <img
              className="pt-8  "
              width="118"
              height="35"
              src="../../vulogo.png"
              alt="login form image"
            />
          </div> */}
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List className="  text-black">
            <Link href="/">
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon className="text-black" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </Link>
          </List>
          <List className="mt-2 text-black">
            {roles.includes("admin") && (
              <>
                <Link href="/users/list">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Users List" />
                  </ListItemButton>
                </Link>
                <Link href="/listofroles">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Roles List" />
                  </ListItemButton>
                </Link>
                <Link href="/department/list">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Departments List" />
                  </ListItemButton>
                </Link>
                <Link href="/designation/list">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Designations List" />
                  </ListItemButton>
                </Link>
                <Link href="/libraries/list">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Libraries List" />
                  </ListItemButton>
                </Link>
              </>
            )}
            {roles.includes("librarian") && (
              <>
                <Link href="/language/list">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Languages List" />
                  </ListItemButton>
                </Link>
                <Link href="/categories">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Categories List" />
                  </ListItemButton>
                </Link>
                <Link href="/materialtype/list">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="MaterialTypes List" />
                  </ListItemButton>
                </Link>
                <Link href="/Publisher/list">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Publishers List" />
                  </ListItemButton>
                </Link>
                <Link href="/currencies/list">
                  <ListItemButton>
                    <ListItemIcon>
                      <SubjectIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Currencies List" />
                  </ListItemButton>
                </Link>
                <ListItemButton onClick={handleClick}>
                  <ListItemIcon>
                    <BadgeOutlinedIcon className="text-black" />
                  </ListItemIcon>
                  <ListItemText primary="Assets List" />
                  {open1 ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={open1} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding className="font-serif">
                    <Link href="/books/list">
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <SubjectIcon className="text-black " />
                        </ListItemIcon>
                        <ListItemText primary="Books List" />
                      </ListItemButton>
                    </Link>

                    <Link href="/magazines/list">
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <SubjectIcon className="text-black " />
                        </ListItemIcon>
                        <ListItemText primary="Magazines List" />
                      </ListItemButton>
                    </Link>
                    <Link href="/journals/list">
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <SubjectIcon className="text-black " />
                        </ListItemIcon>
                        <ListItemText primary="Journals List" />
                      </ListItemButton>
                    </Link>
                    <Link href="/novels/list">
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <SubjectIcon className="text-black " />
                        </ListItemIcon>
                        <ListItemText primary="Novels List" />
                      </ListItemButton>
                    </Link>
                    <Link href="/ebooks/list">
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <SubjectIcon className="text-black " />
                        </ListItemIcon>
                        <ListItemText primary="e-Books List" />
                      </ListItemButton>
                    </Link>
                  </List>
                </Collapse>
              </>
            )}
            {roles.includes("user") && (
              <>
                <Link href="/libraryassets/list">
                  <ListItemButton>
                    <ListItemIcon>
                      <BadgeOutlinedIcon className="text-black " />
                    </ListItemIcon>
                    <ListItemText primary="Assets List" />
                  </ListItemButton>
                </Link>
              </>
            )}
          </List>
        </Drawer>
        <Main open={open} className="mt-20  mb-20 max-h-fit">
          {children}
        </Main>
      </Box>
      <Foot />
    </Box>
  );
}
