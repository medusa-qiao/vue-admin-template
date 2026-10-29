// 菜单使用字符串图标时，在这里注册所需的本地图标。
import { getSvgInfo } from "@pureadmin/utils";
import { addIcon } from "@iconify/vue/dist/offline";
import Home from "~icons/ep/home-filled?raw";
import Search from "~icons/ri/search-line?raw";

// unplugin-icons 的 ?raw 返回 SVG 字符串；默认模块声明仍按 Vue 组件处理。
addIcon("ep/home-filled", getSvgInfo(Home as unknown as string));
addIcon("ri/search-line", getSvgInfo(Search as unknown as string));
