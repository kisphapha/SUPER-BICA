import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryNav from '../../components/features/CategoryNav'
import MenuItem from '@mui/material/MenuItem'
import { UserContext, UserProvider } from '../../UserContext'
import Header from '../../components/common/Header'
import AddressPopup from '../../components/features/AddressPopup/AddressPopup'
import Popup from 'reactjs-popup'
import RefreshIcon from '@mui/icons-material/Refresh';
import ImageUploader from '../../components/features/ImageUploader/index'
import Navbar from '../../components/common/Navbar'
import {
    Button, IconButton, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Slider, Icon
} from '@mui/material'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'


export default function Custom() {
    const { user } = useContext(UserContext)
    const API_key = import.meta.env.VITE_IMAGE_API;
    const host = 'https://api.imgbb.com/1/upload';
    const expiration = 9999999;
    const navigate = useNavigate()
    const location = useLocation();
    const state = location.state
    const id = state ? state.orderId : null;
    //Cage properties
    const [name, setName] = useState('')
    const [height,setHeight] = useState(40)
    const [width, setWidth] = useState(40)
    const [length, setLength] = useState(40)
    const [shapes, setShape] = useState([])
    const [selectedShape, setSelectedShape] = useState('')
    const [birdType, setBirdType] = useState('')
    const [otherDesc, setOtherDesc] = useState('')
    const [material, setMaterial] = useState(31)
    const [color, setColor] = useState('')
    const [custom_shape_image, set_custom_shape_image] = useState([])
    const [customShapeUrls, setCustomShapeUrls] = useState([])
    const [inflateLevel, setInflateLevel] = useState(20)
    const [inflatePos, setInflatePos] = useState(50)
    const [outlinePattern, setOutlinePattern] = useState(31)
    const [custom_outline_img, set_custom_outline_img] = useState([])
    const [custom_outline_desc, set_custom_outline_desc] = useState('')
    const [cornerPattern, setCornerPattern] = useState(31)
    const [custom_corner_img, set_custom_corner_img] = useState([])
    const [custom_corner_desc, set_custom_corner_desc] = useState('')
    const [detailLevel, setDetailLevel] = useState(20)
    const [staffId, setStaffId] = useState(0)
    const [estimatedPrice, setEstimatedPrice] = useState(100000)
    const [estimatedWork, setEsimatedWork] = useState(1)

    const [hook_height, setHook_height] = useState(8)
    const [hook_pattern_image, set_hook_pattern_image] = useState([])
    const [hookPattern, setHookPattern] = useState(31)
    const [hookPatternDesc, setHookPatternDesc] = useState('')
    const [hookColor, setHookColor] = useState('')
    const [hookStyle, setHookStyle] = useState(31)
    const [hookMaterial, setHookMaterial] = useState(31)

    const [door_height, setDoor_height] = useState(10)
    const [door_width, setDoor_width] = useState(10)
    const [door_pattern_image, set_door_pattern_image] = useState([])
    const [doorPattern, setDoorPattern] = useState(31)
    const [doorPatternDesc, setDoorPatternDesc] = useState('')
    const [doorColor, setDoorColor] = useState('')
    const [doorStyle, setDoorStyle] = useState(31)
    const [doorMode, setDoorMode] = useState(31)
    const [doorMaterial, setDoorMaterial] = useState(31)

    const [spoke_number_ver, setSpoke_number_ver] = useState(64)
    const [spoke_number_hor, setSpoke_number_hor] = useState(3)
    const [spokeColor, setSpokeColor] = useState('')
    const [spokeMaterial, setSpokeMaterial] = useState(31)

    const [top_pattern_image, set_top_pattern_image] = useState([])
    const [topPattern, setTopPattern] = useState(31)
    const [topPatternDesc, setTopPatternDesc] = useState('')
    const [topColor, setTopColor] = useState('')
    const [topStyle, setTopStyle] = useState(31)
    const [topMaterial, setTopMaterial] = useState(31)

    const [bottom_pattern_image, set_bottom_pattern_image] = useState([])
    const [bottomPattern, setBottomPattern] = useState(31)
    const [bottomPatternDesc, setBottomPatternDesc] = useState('')
    const [bottomTilt, setBottomTilt] = useState(10)
    const [bottomColor, setBottomColor] = useState('')
    const [bottomStyle, setBottomStyle] = useState(31)
    const [bottomMaterial, setBottomMaterial] = useState(31)

    //Comboboxes
    const [hookStyleList, setHookStyleList] = useState([])
    const [botStyleList, setBotStyleList] = useState([])
    const [doorStyleList, setDoorStyleList] = useState([])
    const [patternList, setPatternList] = useState([])
    const [materialList, setMaterialList] = useState([])
    const [doorModeList, setDoorModeList] = useState([])
    const [topStyleList, setTopStyleList] = useState([])
    const [priceList, setPriceList] = useState([])

    //Boolean values
    const [customShape, setCustomShape] = useState(false)
    const [customHook, setCustomHook] = useState(false)
    const [customDoor, setCustomDoor] = useState(false)
    const [customSpoke, setCustomSpoke] = useState(false)
    const [customTop, setCustomTop] = useState(false)
    const [customBottom, setCustomBottom] = useState(false)
    const [isColorAll, setIsColorAll] = useState(false)
    const [isColorTop, setIsColorTop] = useState(false)
    const [isColorBot, setIsColorBot] = useState(false)
    const [isColorDoor, setIsColorDoor] = useState(false)
    const [isColorSpoke, setIsColorSpoke] = useState(false)
    const [isColorHook, setIsColorHook] = useState(false)
    const [isCustomPatternTop, setIsCustomPatternTop] = useState(false)
    const [isCustomPatternBot, setIsCustomPatternBot] = useState(false)
    const [isCustomPatternDoor, setIsCustomPatternDoor] = useState(false)
    const [isCustomPatternHook, setIsCustomPatternHook] = useState(false)
    const [isSwordDoor, setIsSwordDoor] = useState(false)
    const [isPopup, setPopup] = useState(false)
    const [loadBoxes, setLoadBoxes] = useState(false)

    let animationFrameId = null;

    const handleHeightChange = (event) => {
        setHeight(event.target.value)
    }
    const handleWidthChange = (event) => {
        setWidth(event.target.value)
    }
    const handleLengthChange = (event) => {
        setLength(event.target.value)
    }
    const handleColorChange = (event) => {
        const { value } = event.target;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
            setColor(value);
            if (bottomColor == '' || !isColorBot) setBottomColor(value)
            if (topColor == '' || !isColorTop) setTopColor(value)
            if (doorColor == '' || !isColorDoor) setDoorColor(value)
            if (spokeColor == '' || !isColorSpoke) setSpokeColor(value)
            if (hookColor == '' || !isColorHook) setHookColor(value)
            animationFrameId = null;
        });
    }
    const handleMaterialChange = (event) => {
        setMaterial(event.target.value)
    }
    const handleBirdTypeChange = (event) => {
        setBirdType(event.target.value)
    }
    const handleOtherDescriptionChange = (event) => {
        setOtherDesc(event.target.value)
    }
    const handleSelectShape = (id) => {
        setSelectedShape(id)
        if (customShape) {
            setCustomShape(false)
        } 
    }
    const handleCustomShapeChange = (event) => {
        setCustomShape(event.target.checked)
        setSelectedShape("CT")
    }
    const handleInflateLevelChange = (event) => {
        setInflateLevel(event.target.value)
    }
    const handleInflatePosChange = (event) => {
        setInflatePos(event.target.value)
    }
    const handleNameChange = (event) => {
        setName(event.target.value)
    }
    const handleOutlinePatternChange = (event) => {
        setOutlinePattern(event.target.value)
    }
    const handleCornerPatternChange = (event) => {
        setCornerPattern(event.target.value)
    }
    const handleOutlineDescChange = (event) => {
        set_custom_outline_desc(event.target.value)
    }
    const handleCornerDescChange = (event) => {
        set_custom_corner_desc(event.target.value)
    }
    const handleDetailLevelChange = (event) => {
        setDetailLevel(event.target.value)
    }

    const handleHookHeightChange = (event) => {
        setHook_height(event.target.value)
    }
    const handleHookColorChange = (event) => {
        const { value } = event.target;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
            setHookColor(value);
            animationFrameId = null;
        });
    }
    const handleHookMaterialChange = (event) => {
        setHookMaterial(event.target.value)
    }
    const handleHookStyleChange = (event) => {
        setHookStyle(event.target.value)
    }
    const handleHookPatternDescChange = (event) => {
        setHookPatternDesc(event.target.value)
    }

    const handleDoorHeightChange = (event) => {
        setDoor_height(event.target.value)
    }
    const handleDoorWidthChange = (event) => {
        setDoor_width(event.target.value)
    }
    const handleDoorStyleChange = (event) => {
        const isSwordDoorSelected = event.target.value === 13;
        setIsSwordDoor(isSwordDoorSelected);
        setDoorStyle(event.target.value)       
        setDoorMode(31)
    }
    const handleDoorColorChange = (event) => {
        setDoorColor(event.target.value)
        const { value } = event.target;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
            setDoorColor(value);
            animationFrameId = null;
        });
    }
    const handleDoorMaterialChange = (event) => {
        setDoorMaterial(event.target.value)
    }
    const handleDoorModeChange = (event) => {
        setDoorMode(event.target.value)
    }
    const handleDoorPatternDescChange = (event) => {
        setDoorPatternDesc(event.target.value)
    }


    const handleSpokeNumVerChange = (event) => {
        setSpoke_number_ver(event.target.value)
    }
    const handleSpokeNumHorChange = (event) => {
        setSpoke_number_hor(event.target.value)
    }
    const handleSpokeColorChange = (event) => {
        setSpokeColor(event.target.value)
    }
    const handleSpokeMaterialChange = (event) => {
        setSpokeMaterial(event.target.value)
    }

    const handleTopColorChange = (event) => {
        const { value } = event.target;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
            setTopColor(value);
            animationFrameId = null;
        });
    }
    const handleTopMaterialChange = (event) => {
        setTopMaterial(event.target.value)
    }
    const handleTopStyleChange = (event) => {
        setTopStyle(event.target.value)
    }
    const handleTopPatternDescChange = (event) => {
        setTopPatternDesc(event.target.value)
    }


    const handleBottomTiltChange = (event) => {
        setBottomTilt(event.target.value)
    }  
    const handleBottomColorChange = (event) => {
        const { value } = event.target;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
            setBottomColor(value);
            animationFrameId = null;
        });
    }
    const handleBottomMaterialChange = (event) => {
        setBottomMaterial(event.target.value)
    }
    const handleBottomStyleChange = (event) => {
        setBottomStyle(event.target.value)
    }
    const handleBottomPatternDescChange = (event) => {
        setBottomPatternDesc(event.target.value)
    }


    const handleCustomPatternBotChange = (event) => {
        const isCustomPatternSelected = event.target.value === 1;
        setIsCustomPatternBot(isCustomPatternSelected);
        setBottomPattern(event.target.value)
    };
    const handleCustomPatternTopChange = (event) => {
        const isCustomPatternSelected = event.target.value === 1;
        setIsCustomPatternTop(isCustomPatternSelected);
        setTopPattern(event.target.value)

    };
    const handleCustomPatternDoorChange = (event) => {
        const isCustomPatternSelected = event.target.value === 1;
        setIsCustomPatternDoor(isCustomPatternSelected);
        setDoorPattern(event.target.value)

    };
    const handleCustomPatternHookChange = (event) => {
        const isCustomPatternSelected = event.target.value === 1;
        setIsCustomPatternHook(isCustomPatternSelected);
        setHookPattern(event.target.value)
    };

    async function uploadImageToHost(imageData) {
        const response = await axios.postForm(`${host}?expiration=${expiration}&key=${API_key}`, {
            image: imageData.substring(imageData.indexOf(',') + 1)
        });
        return response.data?.data?.url || null;
    }
    async function uploadToHost(mode) {
        const shapeImg = await Promise.all(custom_shape_image.map((image) => uploadImageToHost(image.data_url)));
        const hookPatternImg = await Promise.all(hook_pattern_image.map((image) => uploadImageToHost(image.data_url)));
        const doorPatternImg = await Promise.all(door_pattern_image.map((image) => uploadImageToHost(image.data_url)));
        const topPatternImg = await Promise.all(top_pattern_image.map((image) => uploadImageToHost(image.data_url)));
        const botPatternImg = await Promise.all(bottom_pattern_image.map((image) => uploadImageToHost(image.data_url)));
        const outlineImg = await Promise.all(custom_outline_img.map((image) => uploadImageToHost(image.data_url)));
        const cornerImg = await Promise.all(custom_corner_img.map((image) => uploadImageToHost(image.data_url)));

        const obj = constructObject(shapeImg[0], outlineImg[0], cornerImg[0], hookPatternImg[0], doorPatternImg[0],
            topPatternImg[0],botPatternImg[0]);
        mode == 0 ? handleSubmit(obj) : handleChange(obj)
    }
    function getImageList(images) {
        const imagesFromUrls = images.map((image) => ({
            data_url: image,
        }));
        return (imagesFromUrls);
    }

    const getMaterialPrice = (id) => {
        const material = materialList.find((item) => item.ID === id);
        return material ? material.Price : 1
    }
    const handleConfirm = () => {
        calaculatePrice()
        calaculateWork()
        if (selectedShape == "" || material == 31) {
            alert("Vui lòng chọn hình dáng và vật liệu")
        } else if (customShape && custom_shape_image.length == 0) {
            alert("Vui lòng cung cấp hình ảnh cho hình dáng tùy chỉnh")
        } else if (outlinePattern == 1 && (custom_outline_img.length == 0 && !custom_outline_desc)) {
            alert("Vui lòng cung cấp hình ảnh hoặc mô tả cho họa tiết viền tùy chỉnh")
        } else if (hookPattern == 1 && (!hookPatternDesc && hook_pattern_image.length == 0)) {
            alert("Vui lòng cung cấp hình ảnh hoặc mô tả cho họa tiết móc tùy chỉnh")
        } else if (customHook && cornerPattern == 1 && (custom_corner_img.length == 0 && !custom_corner_desc)) {
            alert("Vui lòng cung cấp hình ảnh hoặc mô tả cho họa tiết góc tùy chỉnh")
        } else if (customDoor && doorPattern == 1 && (!doorPatternDesc && door_pattern_image.length == 0)) {
            alert("Vui lòng cung cấp hình ảnh hoặc mô tả cho họa tiết cửa tùy chỉnh")
        } else if (customTop && topPattern == 1 && (!topPatternDesc && top_pattern_image.length == 0)) {
            alert("Vui lòng cung cấp hình ảnh hoặc mô tả cho họa tiết nắp tùy chỉnh")
        } else if (customBottom && bottomPattern == 1 && (!bottomPatternDesc && bottom_pattern_image.length == 0)) {
            alert("Vui lòng cung cấp hình ảnh hoặc mô tả cho họa tiết đế tùy chỉnh")
        } else if (customHook && hookStyle == 31) {
            alert("Vui lòng chọn kiểu cho móc")
        } else if (customDoor && doorStyle == 31) {
            alert("Vui lòng chọn kiểu cho cửa")
        } else if (customDoor && doorMode == 31 && doorStyle != 13) {
            alert("Vui lòng chọn cơ chế cho cửa")
        } else if (customTop && topStyle == 31) {
            alert("Vui lòng chọn kiểu cho nắp")
        } else if (customBottom && bottomStyle == 31) {
            alert("Vui lòng chọn kiểu cho đế")
        } else if (!user) {
            alert("Vui lòng đăng nhập để hoàn tất đặt hàng")
            handleSaveDraft(false)
        } else {
            if (id) {
                const confirm = window.confirm("Lưu thay đổi?")
                if (confirm) uploadToHost(1)
            } else {
                setPopup(true)
            }
        }
    }
    const handleSubmit = async (request) => {     
        //console.log(request)
        const response = await axios.post("http://localhost:3000/custom/", request, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        await axios.post('http://localhost:3000/notification/', {
            userId: user.Id,
            content: `Lồng tùy chỉnh ` + (name ? name : "Lồng vô danh của " + (user ? user.Name : "vô danh")) + `đã sẵn sàng chờ để duyệt `,
            refId: response.data.customId + 'co',
            refUrl: "/user/customPurchase",
            refPic: null
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        await axios.post('http://localhost:3000/notification/', {
            userId: null,
            content: `${user.Name} đang chờ duyệt 1 lồng tùy chỉnh đã đặt ngày ${new Date(Date.now()).toLocaleDateString()}`,
            refId: null,
            refUrl: "/admin/CustomOrders",
            refPic: user.Picture
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        alert("Đặt hàng thành công!")
        navigate("/user/customPurchase")
    }
    const handleChange = async (request) => {
        //console.log(request)
        await axios.patch("http://localhost:3000/custom", request, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        await axios.post('http://localhost:3000/notification/', {
            userId: staffId,
            content: `${user.Name} đã chỉnh sửa lồng custom mã ${id} (${request.Name})`,
            refId: id + 'coe',
            refUrl: "/admin/CustomOrders",
            refPic: user.Picture
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        alert("Cập nhật thành công!")
        navigate("/user/customPurchase")
    }
    const handleSaveDraft = (show_message) => {
        const obj = constructObject(custom_shape_image, custom_outline_img, custom_corner_img, hook_pattern_image,
            door_pattern_image, top_pattern_image, bottom_pattern_image)
        try {
            localStorage.setItem("custom_template", JSON.stringify(obj))
            if (show_message) alert("Đã lưu nháp")
        } catch {
            if (show_message) alert("Không thể lưu do kích thước ảnh quá lớn. Hãy thử ảnh khác nhỏ hơn")
        }    
    }

    const constructObject = (shapeImg, outlineImg, cornerImg, hookPatternImg, doorPatternImg, topPatternImg, botPatternImg) => {
        var json = {
            OrderId : id,
            Name: name ? name : "Lồng vô danh của " + (user ? user.Name : "vô danh"),
            id: user ? user.Id : 0,
            Length: length,
            Width: width,
            Height: height,
            Shape: selectedShape,
            Shape_img: shapeImg,
            Material: material,
            Color: isColorAll ? color : null,
            BirdType: birdType,
            Inflate_level: selectedShape.trim() == "LS" ? inflateLevel : null,
            Inflate_pos: selectedShape.trim() == "LS" ? inflatePos : null,
            Outline_pattern: outlinePattern,
            Outline_pattern_img: outlinePattern == 1 ? outlineImg : null,
            Outline_pattern_desc: outlinePattern == 1 ? custom_outline_desc : null,
            Corner_pattern: cornerPattern,
            Corner_pattern_img: cornerPattern == 1 ? cornerImg : null,
            Corner_pattern_desc: cornerPattern == 1 ? custom_corner_desc : null,
            Hook_custom: customHook,
            Hook_size: customHook ? hook_height : null,
            Hook_Color: customHook ? (isColorHook ? hookColor : null) : null,
            Hook_material_id: customHook ? (hookMaterial != 31 ? hookMaterial : material) : null,
            Hook_style_id: customHook ? hookStyle : null,
            Hook_pattern: customHook ? hookPattern : null,
            hook_pattern_image: customHook ? (isCustomPatternHook ? hookPatternImg : null) : null,
            hook_pattern_desc: customHook ? (isCustomPatternHook ? hookPatternDesc : null) : null,
            Spoke_custom: customSpoke,
            Spoke_amount_ver: customSpoke ? spoke_number_ver : null,
            Spoke_amount_hor: customSpoke ? spoke_number_hor : null,
            Spoke_material: customSpoke ? (spokeMaterial != 31 ? spokeMaterial : material) : null,
            Spoke_color: customSpoke ? (isColorSpoke ? spokeColor : null) : null,
            Door_custom: customDoor,
            Door_size_x: customDoor ? door_width : null,
            Door_size_y: customDoor ? door_height : null,
            Door_color: customDoor ? (isColorDoor ? doorColor : null) : null,
            Door_material: customDoor ? (doorMaterial != 31 ? doorMaterial : material) : null,
            Door_style_id: customDoor ? doorStyle : null,
            Door_mode: customDoor ? doorMode : null,
            Door_pattern: customDoor ? doorPattern : null,
            Door_pattern_image: customDoor ? (isCustomPatternDoor ? doorPatternImg : null) : null,
            Door_pattern_desc: customDoor ? (isCustomPatternDoor ? doorPatternDesc : null) : null,
            Top_custom: customTop,
            Top_color: customTop ? topColor : null,
            Top_material: customTop ? (topMaterial != 31 ? topMaterial : material) : null,
            Top_style_id: customTop ? topStyle : null,
            Top_pattern: customTop ? topPattern : null,
            Top_pattern_image: customTop ? (isCustomPatternTop ? topPatternImg : null) : null,
            Top_pattern_desc: customTop ? (isCustomPatternTop ? topPatternDesc : null) : null,
            Bottom_custom: customBottom,
            Bottom_color: customBottom ? bottomColor : null,
            Bottom_material: customBottom ? (bottomMaterial != 31 ? bottomMaterial : material) : null,
            Bottom_style_id: customBottom ? bottomStyle : null,
            Bottom_pattern: customBottom ? bottomPattern : null,
            Bottom_pattern_image: customBottom ? (isCustomPatternBot ? botPatternImg : null) : null,
            Bottom_pattern_desc: customBottom ? (isCustomPatternBot ? bottomPatternDesc : null) : null,
            Bottom_tilt: customBottom ? bottomTilt : null,
            Other_description: otherDesc,
            Detail: detailLevel,
            Price: calaculatePrice(),
            Work_time: calaculateWork()
        }
        
        return json
    }

    const loadFromTemplate = () => {
        const template = localStorage.getItem("custom_template");
        if (template) {
            const parsedTemplate = JSON.parse(template);
            if (parsedTemplate) {
                //Nhớ load các giá trị boolean khác nữa
                if (parsedTemplate.Name) setName(parsedTemplate.Name);
                if (parsedTemplate.Length) setLength(parsedTemplate.Length);
                if (parsedTemplate.Height) setHeight(parsedTemplate.Height);
                if (parsedTemplate.Width) setWidth(parsedTemplate.Width);
                if (parsedTemplate.Shape) setSelectedShape(parsedTemplate.Shape);
                if (parsedTemplate.Shape == "Custom") setCustomShape(true);
                if (parsedTemplate.Shape_img) set_custom_shape_image(parsedTemplate.Shape_img);
                if (parsedTemplate.Material) setMaterial(parsedTemplate.Material);
                if (parsedTemplate.Color) setIsColorAll(true);
                if (parsedTemplate.Color) setColor(parsedTemplate.Color);
                if (parsedTemplate.BirdType) setBirdType(parsedTemplate.BirdType);
                if (parsedTemplate.Inflate_level) setInflateLevel(parsedTemplate.Inflate_level);
                if (parsedTemplate.Inflate_pos) setInflatePos(parsedTemplate.Inflate_pos);
                if (parsedTemplate.Outline_pattern) setOutlinePattern(parsedTemplate.Outline_pattern);
                if (parsedTemplate.Outline_pattern_img) set_custom_outline_img(parsedTemplate.Outline_pattern_img);
                if (parsedTemplate.Outline_pattern_desc) set_custom_outline_desc(parsedTemplate.Outline_pattern_desc);
                if (parsedTemplate.Corner_pattern) setCornerPattern(parsedTemplate.Corner_pattern);
                if (parsedTemplate.Corner_pattern_img) set_custom_corner_img(parsedTemplate.Corner_pattern_img);
                if (parsedTemplate.Corner_pattern_desc) set_custom_outline_desc(parsedTemplate.Corner_pattern_desc);

                if (parsedTemplate.Hook_custom) setCustomHook(true);
                if (parsedTemplate.Hook_size) setHook_height(parsedTemplate.Hook_size);
                if (parsedTemplate.Hook_Color) setIsColorHook(true);
                if (parsedTemplate.Hook_Color) setHookColor(parsedTemplate.Hook_Color);
                if (parsedTemplate.Hook_material_id) setHookMaterial(parsedTemplate.Hook_material_id);
                if (parsedTemplate.Hook_style_id) setHookStyle(parsedTemplate.Hook_style_id);
                if (parsedTemplate.Hook_pattern) setHookPattern(parsedTemplate.Hook_pattern);
                if (parsedTemplate.Hook_pattern == 1) setIsCustomPatternHook(true);
                if (parsedTemplate.hook_pattern_image) set_hook_pattern_image(parsedTemplate.hook_pattern_image);
                if (parsedTemplate.hook_pattern_desc) setHookPatternDesc(parsedTemplate.hook_pattern_desc);

                if (parsedTemplate.Spoke_custom) setCustomSpoke(true);
                if (parsedTemplate.Spoke_amount_ver) setSpoke_number_ver(parsedTemplate.Spoke_amount_ver);
                if (parsedTemplate.Spoke_amount_hor) setSpoke_number_hor(parsedTemplate.Spoke_amount_hor);
                if (parsedTemplate.Spoke_material) setSpokeMaterial(parsedTemplate.Spoke_material);
                if (parsedTemplate.Spoke_color) setSpokeColor(parsedTemplate.Spoke_color);

                if (parsedTemplate.Door_custom) setCustomDoor(true);
                if (parsedTemplate.Door_size_x) setDoor_width(parsedTemplate.Door_size_x);
                if (parsedTemplate.Door_size_y) setDoor_height(parsedTemplate.Door_size_y);
                if (parsedTemplate.Door_color) setIsColorDoor(true);
                if (parsedTemplate.Door_color) setDoorColor(parsedTemplate.Door_color);
                if (parsedTemplate.Door_material_id) setDoorMaterial(parsedTemplate.Door_material_id);
                if (parsedTemplate.Door_style_id) setDoorStyle(parsedTemplate.Door_style_id);
                if (parsedTemplate.Door_mode) setDoorMode(parsedTemplate.Door_mode);
                if (parsedTemplate.Door_pattern) setDoorPattern(parsedTemplate.Door_pattern);
                if (parsedTemplate.Door_pattern == 1) setIsCustomPatternDoor(true);
                if (parsedTemplate.Door_pattern_image) set_door_pattern_image(parsedTemplate.Door_pattern_image);
                if (parsedTemplate.Door_pattern_desc) setDoorPatternDesc(parsedTemplate.Door_pattern_desc);

                if (parsedTemplate.Top_custom) setCustomTop(true);
                if (parsedTemplate.Top_color) setIsColorTop(true);
                if (parsedTemplate.Top_color) setTopColor(parsedTemplate.Top_color);
                if (parsedTemplate.Top_material_id) setTopMaterial(parsedTemplate.Top_material_id);
                if (parsedTemplate.Top_style_id) setTopStyle(parsedTemplate.Top_style_id);
                if (parsedTemplate.Top_pattern) setTopPattern(parsedTemplate.Top_pattern);
                if (parsedTemplate.Top_pattern == 1) setIsCustomPatternTop(true);
                if (parsedTemplate.Top_pattern_image) set_top_pattern_image(parsedTemplate.Top_pattern_image);
                if (parsedTemplate.Top_pattern_desc) setTopPatternDesc(parsedTemplate.Top_pattern_desc);

                if (parsedTemplate.Bottom_custom) setCustomBottom(true);
                if (parsedTemplate.Bottom_tilt) setBottomTilt(parsedTemplate.Bottom_tilt);
                if (parsedTemplate.Bottom_color) setIsColorBot(true);
                if (parsedTemplate.Bottom_color) setBottomColor(parsedTemplate.Bottom_color);
                if (parsedTemplate.Bottom_material_id) setBottomMaterial(parsedTemplate.Bottom_material_id);
                if (parsedTemplate.Bottom_style_id) setBottomStyle(parsedTemplate.Bottom_style_id);
                if (parsedTemplate.Bottom_pattern) setBottomPattern(parsedTemplate.Bottom_pattern);
                if (parsedTemplate.Bottom_pattern == 1) setIsCustomPatternBot(true);
                if (parsedTemplate.Bottom_pattern_image) set_bottom_pattern_image(parsedTemplate.Bottom_pattern_image);
                if (parsedTemplate.Bottom_pattern_desc) setBottomPatternDesc(parsedTemplate.Bottom_pattern_desc);

                if (parsedTemplate.Other_description) setOtherDesc(parsedTemplate.Other_description);
                if (parsedTemplate.Detail) setDetailLevel(parsedTemplate.Detail);
                if (parsedTemplate.Price) setEstimatedPrice(parsedTemplate.Price);
                if (parsedTemplate.Work_time) setEsimatedWork(parsedTemplate.Work_time);
                // Set the rest of the variables according to the template properties
            }
        }
    };
    const loadFromOrderId = (obj) => {
        console.log(obj)
        if (obj.general) {
            setName(obj.general.Name);
            setLength(obj.general.Length);
            setHeight(obj.general.Height);
            setWidth(obj.general.Width);
            setSelectedShape(obj.general.Shape);
            if (obj.general.Shape.trim() == "CT") setCustomShape(true);
            if (obj.general.Shape_picture) set_custom_shape_image(getImageList([obj.general.Shape_picture]));//Consider this!!
            setMaterial(materialList.find((m) => (m.Name === obj.general.Material)).ID);
            if (obj.general.Color) setIsColorAll(true);
            if (obj.general.Color) setColor(obj.general.Color);
            if (obj.other.BirdType) setBirdType(obj.other.BirdType);
            setInflateLevel(obj.general.InflateLevel ? obj.general.InflateLevel : null);
            setInflatePos(obj.general.InflatePosition ? obj.general.InflatePosition : null);
            if (obj.general.Outline_Pattern == "Tùy chỉnh") {
                setOutlinePattern(1)
            } else {
                if (obj.general.Outline_Pattern != "Không có") setOutlinePattern(patternList.find((p) => (p.Name === obj.general.Outline_Pattern)).Id);
            }
            if (obj.general.Outline_pattern_img) set_custom_outline_img(getImageList([obj.general.Outline_pattern_img]));
            if (obj.general.Outline_pattern_desc) set_custom_outline_desc(obj.general.Outline_pattern_desc);
            if (obj.general.Corner_Pattern == "Tùy chỉnh") {
                setCornerPattern(1)
            } else {
                if (obj.general.Corner_Pattern != "Không có") setCornerPattern(patternList.find((p) => (p.Name === obj.general.Corner_Pattern)).Id);
            }
            if (obj.general.Corner_pattern_img) set_custom_corner_img(getImageList([obj.general.Corner_pattern_img]));
            if (obj.general.Corner_pattern_desc) set_custom_outline_desc(obj.general.Corner_pattern_desc);

            if (obj.hook) {
                if (obj.hook.Hook_custom) setCustomHook(true);
                if (obj.hook.Hook_size) setHook_height(obj.hook.Hook_size);
                if (obj.hook.Hook_Color) setIsColorHook(true);
                if (obj.hook.Hook_Color) setHookColor(obj.hook.Hook_Color);
                if (obj.hook.Hook_Material) setHookMaterial(materialList.find((m) => (m.Name === obj.hook.Hook_Material)).ID);
                if (obj.hook.Hook_Style) setHookStyle(hookStyleList.find((p) => (p.Name === obj.hook.Hook_Style)).Id);
                if (obj.hook.Hook_Pattern == "Tùy chỉnh") {
                    setIsCustomPatternHook(true); setHookPattern(1)
                } else if (obj.hook.Hook_Pattern != "Không có") {
                    if (obj.hook.Hook_Pattern) setHookPattern(patternList.find((p) => (p.Name === obj.hook.Hook_Pattern)).Id);
                }
                if (obj.hook.Hook_pattern_img) set_hook_pattern_image(getImageList([obj.hook.Hook_pattern_img]));
                if (obj.hook.Hook_pattern_description) setHookPatternDesc(obj.hook.Hook_pattern_description);
            }
            if (obj.spokes) {
                if (obj.spokes.Spoke_custom) setCustomSpoke(true);
                if (obj.spokes.Spoke_amount_ver) setSpoke_number_ver(obj.spokes.Spoke_amount_ver);
                if (obj.spokes.Spoke_amount_hor) setSpoke_number_hor(obj.spokes.Spoke_amount_hor);
                if (obj.spokes.Spoke_material) setSpokeMaterial(materialList.find((m) => (m.Name === obj.spokes.Spoke_material)).ID);
                if (obj.spokes.Spoke_Color) setSpokeColor(obj.spokes.Spoke_Color);
            }
            if (obj.door) {
                if (obj.door.Door_custom) setCustomDoor(true);
                if (obj.door.Door_size_x) setDoor_width(obj.door.Door_size_x);
                if (obj.door.Door_size_y) setDoor_height(obj.door.Door_size_y);
                if (obj.door.Door_color) setIsColorDoor(true);
                if (obj.door.Door_color) setDoorColor(obj.door.Door_color);
                if (obj.door.Door_Material) setDoorMaterial(materialList.find((m) => (m.Name === obj.door.Door_Material)).ID);
                if (obj.door.Door_Style) setDoorStyle(doorStyleList.find((p) => (p.Name === obj.door.Door_Style)).Id);
                if (obj.door.Door_Mode && obj.door.Door_Mode != "Không có") setDoorMode(doorModeList.find((p) => (p.Name === obj.door.Door_Mode)).Id);
                if (obj.door.Door_Pattern == "Tùy chỉnh") {
                    setIsCustomPatternDoor(true); setDoorPattern(1)
                } else if (obj.door.Door_Pattern != "Không có") {
                    if (obj.door.Door_Pattern) setDoorPattern(patternList.find((p) => (p.Name === obj.door.Door_Pattern)).Id);
                }
                console.log(getImageList([obj.door.Door_pattern_img]))
                if (obj.door.Door_pattern_img) set_door_pattern_image(getImageList([obj.door.Door_pattern_img]));
                if (obj.door.Door_pattern_description) setDoorPatternDesc(obj.door.Door_pattern_description);
            }
            if (obj.top) {
                if (obj.top.Top_custom) setCustomTop(true);
                if (obj.top.Top_color) setIsColorTop(true);
                if (obj.top.Top_color) setTopColor(obj.top.Top_color);
                if (obj.top.Top_Material) setTopMaterial(materialList.find((m) => (m.Name === obj.top.Top_Material)).ID);
                if (obj.top.Top_Style) setTopStyle(topStyleList.find((p) => (p.Name === obj.top.Top_Style)).Id);
                if (obj.top.Top_Pattern == "Tùy chỉnh") {
                    setIsCustomPatternTop(true); setTopPattern(1)
                } else if (obj.top.Top_Pattern != "Không có") {
                    if (obj.top.Top_Pattern) setTopPattern(patternList.find((p) => (p.Name === obj.top.Top_Pattern)).Id);
                }
                if (obj.top.Top_pattern_img) set_top_pattern_image(getImageList([obj.top.Top_pattern_img]));
                if (obj.top.Top_pattern_description) setTopPatternDesc(obj.top.Top_pattern_description);
            }
            if (obj.bottom) {
                if (obj.bottom.Bottom_custom) setCustomBottom(true);
                if (obj.bottom.Bottom_color) setIsColorBot(true);
                if (obj.bottom.Bottom_color) setBottomColor(obj.bottom.Bottom_color);
                if (obj.bottom.Bottom_tilt) setBottomTilt(obj.bottom.Bottom_tilt);
                if (obj.bottom.Bottom_Material) setBottomMaterial(materialList.find((m) => (m.Name === obj.bottom.Bottom_Material)).ID);
                if (obj.bottom.Bottom_Style) setBottomStyle(botStyleList.find((p) => (p.Name === obj.bottom.Bottom_Style)).Id);
                if (obj.bottom.Bottom_Pattern == "Tùy chỉnh") {
                    setIsCustomPatternBot(true); setBottomPattern(1)
                } else if (obj.bottom.Bottom_Pattern != "Không có") {
                    if (obj.bottom.Bottom_Pattern) setBottomPattern(patternList.find((p) => (p.Name === obj.bottom.Bottom_Pattern)).Id);
                }
                if (obj.bottom.Bottom_pattern_img) set_bottom_pattern_image(getImageList([obj.bottom.Bottom_pattern_img]));
                if (obj.bottom.Bottom_pattern_description) setBottomPatternDesc(obj.bottom.Bottom_pattern_description);
            }
            if (obj.other.Other_description) setOtherDesc(obj.other.Other_description);
            if (obj.other.Detail) setDetailLevel(obj.other.Detail);
            if (obj.other.Price_final) setEstimatedPrice(obj.other.Price_final);
            if (obj.other.Final_time) setEsimatedWork(obj.other.Final_time);            
        }
    };
    const resetState = () => {
        const confirmed = window.confirm('Bạn có chắc chắn muốn reset? Mọi thay đổi của bạn sẽ biến mất');
        if (confirmed) {
            setName('');
            setHeight(40);
            setWidth(40);
            setLength(40);
            setSelectedShape('');
            setBirdType('');
            setOtherDesc('');
            setMaterial(31);
            setColor('');
            set_custom_shape_image([]);
            setCustomShapeUrls([]);
            setInflateLevel(20);
            setInflatePos(50);
            setOutlinePattern(31);
            set_custom_outline_img([]);
            set_custom_outline_desc('');
            setCornerPattern(31);
            set_custom_corner_img([]);
            set_custom_corner_desc('');
            setDetailLevel(20);
            setEstimatedPrice(100000);
            setEsimatedWork(1);
            setHook_height(8);
            set_hook_pattern_image([]);
            setHookPattern(31);
            setHookPatternDesc('');
            setHookColor('');
            setHookStyle(31);
            setHookMaterial(31);

            setDoor_height(10);
            setDoor_width(10);
            set_door_pattern_image([]);
            setDoorPattern(31);
            setDoorPatternDesc('');
            setDoorColor('');
            setDoorStyle(31);
            setDoorMode(31);
            setDoorMaterial(31);

            setSpoke_number_ver(64);
            setSpoke_number_hor(3);
            setSpokeColor('');
            setSpokeMaterial(31);

            set_top_pattern_image([]);
            setTopPattern(31);
            setTopPatternDesc('');
            setTopColor('');
            setTopStyle(31);
            setTopMaterial(31);

            set_bottom_pattern_image([]);
            setBottomPattern(31);
            setBottomPatternDesc('');
            setBottomTilt(10);
            setBottomColor('');
            setBottomStyle(31);
            setBottomMaterial(31);

            setCustomShape(false);
            setCustomHook(false);
            setCustomDoor(false);
            setCustomSpoke(false);
            setCustomTop(false);
            setCustomBottom(false);
            setIsColorAll(false);
            setIsColorTop(false);
            setIsColorBot(false);
            setIsColorDoor(false);
            setIsColorSpoke(false);
            setIsColorHook(false);
            setIsCustomPatternTop(false);
            setIsCustomPatternBot(false);
            setIsCustomPatternDoor(false);
            setIsCustomPatternHook(false);
            setIsSwordDoor(false);
            setPopup(false);
        }
    };

    const calaculatePrice = () => {
        let price = 100000;
        let default_material_price = 100000
        let paint_price = 100000
        if (customShape) price += priceList.find((item) => item.Name === "Custom hình dáng").Price;
        if (customHook) {
            price += priceList.find((item) => item.Name === "Custom móc").Price;
            if (isCustomPatternHook) {
                price += priceList.find((item) => item.Name === "Họa tiết móc tùy chỉnh").Price;
                if (hookPattern != 31) price += priceList.find((item) => item.Name === "Họa tiết móc").Price;
            }
        }
        if (customDoor) {
            price += priceList.find((item) => item.Name === "Custom cửa").Price;
            if (isCustomPatternDoor) {
                price += priceList.find((item) => item.Name === "Họa tiết cửa tùy chỉnh").Price;
                if (doorPattern != 31) price += priceList.find((item) => item.Name === "Họa tiết cửa").Price;
            }
        }
        if (customSpoke) {
            price += priceList.find((item) => item.Name === "Custom nan").Price;
        }
        if (customTop) {
            price += priceList.find((item) => item.Name === "Custom nắp").Price;
            if (isCustomPatternTop) {
                price += priceList.find((item) => item.Name === "Họa tiết nắp tùy chỉnh").Price;
                if (topPattern != 31) price += priceList.find((item) => item.Name === "Họa tiết nắp").Price;
            }
        }            
        if (customBottom) {
            price += priceList.find((item) => item.Name === "Custom đế").Price;
            if (isCustomPatternBot) {
                price += priceList.find((item) => item.Name === "Họa tiết đế tùy chỉnh").Price;
                if (bottomPattern != 31) price += priceList.find((item) => item.Name === "Họa tiết đế").Price;
            }
        }
        if (selectedShape.trim() == "LV" | selectedShape.trim() == "LG") {
            if (outlinePattern != 31) price += priceList.find((item) => item.Name === "Họa tiết viền").Price;
            if (cornerPattern != 31) price += priceList.find((item) => item.Name === "Họa tiết góc").Price;
            if (outlinePattern == 1) price += priceList.find((item) => item.Name === "Họa tiết viền tùy chỉnh").Price;
            if (cornerPattern == 1) price += priceList.find((item) => item.Name === "Họa tiết góc tùy chỉnh").Price;
        }
        let area_hook = 1, area_spokes = 1, area_door = 1, area_top = 1, area_bottom = 1
        switch (selectedShape.trim()) {
            case "LT":
                area_top = (width > length ? width * width * Math.PI * width / 7 : length * length * Math.PI * length / 7)
                area_bottom = (width > length ? width * width * Math.PI * width / 7 : length * length * Math.PI * length / 7)
                break;
            case "LG":
            case "LS":
            case "LV":
            default  :
                area_top = topStyle == 0 ? width * length * width / 7 : spoke_number_ver/4 * 0.5 * length
                area_bottom = width * length * length / 7
                break;

        }
        area_hook = hook_height * hook_height * 5
        area_spokes = spoke_number_ver * 0.5 * height + spoke_number_hor * (width + length) * 2 * 0.5
        area_door = door_height * door_width * 5
        let total_area = (area_top + area_bottom + area_door + area_spokes + area_hook)
        price += total_area / 10000 * getMaterialPrice(material) + total_area / 10000 * (isColorAll ? paint_price : 1) 
        price += area_top / 10000 * getMaterialPrice(topMaterial != 31 ? topMaterial : material)
            + area_top / 10000 * ((isColorTop && customTop) ? paint_price : 1) 
        price += area_bottom / 10000 * getMaterialPrice(bottomMaterial != 31 ? bottomMaterial : material)
            + area_bottom / 10000 * ((isColorBot && customBottom)? paint_price : 1)
        price += area_door / 10000 * getMaterialPrice(doorMaterial != 31 ? doorMaterial : material)
            + area_door / 10000 * ((isColorDoor && customDoor) ? paint_price : 1)
        price += area_hook / 10000 * getMaterialPrice(hookMaterial != 31 ? hookMaterial : material)
            + area_hook / 10000 * ((isColorHook && customHook) ? paint_price : 1) 
        price += area_spokes / 10000 * getMaterialPrice(spokeMaterial != 31 ? spokeMaterial : material)
            + area_spokes / 10000 * ((isColorSpoke && customSpoke) ? paint_price : 1)
        price *= 0.5 +  detailLevel/50
        setEstimatedPrice(price)
        return price
    }
    const calaculateWork = () => {
        let work = 12;
        if (customShape) work += 24
        if (customHook) {
            work += 6
            if (isColorHook) work += 1
            if (isCustomPatternHook) {
                work += 10
                if (hookPattern != 31) work += 9
            }
        }
        if (customDoor) {
            work += 6
            if (isColorDoor) work += 1
            if (isCustomPatternDoor) {
                work += 10
                if (doorPattern != 31) work += 9
            }
        }
        if (customSpoke) {
            work += 10
            if (isColorSpoke) work += 2
        }
        if (customTop) {
            work += 9
            if (isColorTop) work += 2
            if (isCustomPatternTop) {
                work += 18
                if (topPattern != 31) work += 12
            }
        }
        if (customBottom) {
            work += 9
            if (isColorBot) work += 2
            if (isCustomPatternBot) {
                work += 18
                if (bottomPattern != 31) work += 12
            }
        }
        if (selectedShape.trim() == "LV" | selectedShape.trim() == "LG") {
            if (outlinePattern != 31) work += 10
            if (cornerPattern != 31) work += 10
            if (outlinePattern == 1) work += 18
            if (cornerPattern == 1) work += 18
        }    
        if (isColorAll) work += 3
        work *= 0.5 + detailLevel / 50
        const estimatedWork = (work / 12).toFixed(2);
        setEsimatedWork(estimatedWork);
        return estimatedWork
    }

    const fetchShapes = async () => {
        const response = await axios.get("http://localhost:3000/category/")
        if (response) {
            setShape(response.data)
        }
    }
    const fetchComboBoxes = async () => {
        const hookStyles = await axios.get("http://localhost:3000/custom/hook%20style")
        if (hookStyles) {
            setHookStyleList(hookStyles.data)
        }
        const botStyles = await axios.get("http://localhost:3000/custom/bottom%20style")
        if (botStyles) {
            setBotStyleList(botStyles.data)
        }
        const topStyles = await axios.get("http://localhost:3000/custom/top%20style")
        if (topStyles) {
            setTopStyleList(topStyles.data)
        }
        const doorStyles = await axios.get("http://localhost:3000/custom/door%20style")
        if (doorStyles) {
            setDoorStyleList(doorStyles.data)
        }
        const doorModes = await axios.get("http://localhost:3000/custom/door%20mode")
        if (doorModes) {
            setDoorModeList(doorModes.data)
        }
        const patterns = await axios.get("http://localhost:3000/custom/pattern")
        if (patterns) {
            setPatternList(patterns.data)
        }
        const materials = await axios.get("http://localhost:3000/material/custom")
        if (materials) {
            setMaterialList(materials.data)
        }
        if (materials && patterns && doorModes && doorStyles && topStyles && botStyles && hookStyles) {
            setLoadBoxes(true)
        }
    }
    const fetchPrice = async () => {
        const response = await axios.get("http://localhost:3000/custom/pricing")
        if (response) {
            setPriceList(response.data)
        }

    }
    const fetchAvailableResource = async () => {
        const response = await axios.get('http://localhost:3000/custom/order/' + id, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        if (response.data) {
            console.log(response.data)
            setStaffId(response.data.other.StaffID)
            loadFromOrderId(response.data)
        }
    }


    const marks = [
        {
            value: 20,
            label: '20 cm'
        }, {
            value: 100,
            label: '100 cm'
        }

    ]

    //useEffect(() => {
    //    if (!customShape) {
    //        setCustomShape(false);
    //    }
    //}, [customShape]);
    useEffect(() => {
        fetchShapes()
        fetchComboBoxes()
        fetchPrice()
        
    }, [])
    useEffect(() => {
        if (loadBoxes) {
            if (id)
                fetchAvailableResource()
            else
                loadFromTemplate()
        }
    }, [loadBoxes])

    return (
        <div>
            <UserProvider>
                <Header />
                <Navbar />
            </UserProvider>
            <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current="Lồng tùy chỉnh" />
            <div className="mt-8 text-2xl font-bold flex justify-center">
                Thiết kế lồng chim theo cách của bạn
            </div>
            <div>
                <div className="ml-6 font-bold text-xl bg-slate-200 p-4">Hình dáng</div>
                <Table>
                    <TableRow>
                        {
                            shapes.map((shape) => (
                                shape.Allow_customize && (
                                    <TableCell key={shape.id}>
                                        <Button variant={selectedShape == shape.id ? "contained" : "standard"} value={shape.id}  onClick={() => handleSelectShape(shape.id)}>
                                            <img className="w-48 h-48" src={shape.imageUrl}></img>
                                        </Button>
                                    </TableCell>
                                )
                            ))
                        }
                        </TableRow>
                </Table>
                <div className="text-xl">
                    <Checkbox checked={customShape} onChange={handleCustomShapeChange} /> Sử dụng hình dáng khác
                    {customShape && (
                        <div className="ml-16 text-lg font-bold">
                            Upload ảnh hình dáng theo ý bạn
                            <ImageUploader
                                images={custom_shape_image}
                                setImages={set_custom_shape_image}
                                maxNumber={1}
                                setUrls={setCustomShapeUrls}
                            />
                        </div>
                    )}
                </div>
                

                <div className="mt-8 ml-6 font-bold text-xl bg-slate-200 p-4">Tổng quan</div>
                <div className="ml-6 w-1/2">
                    <Table>
                        <colgroup>
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '70%' }} />
                            <col style={{ width: '10%' }} />
                        </colgroup>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Tên lồng của bạn
                                </TableCell>
                                <TableCell>
                                    <TextField fullWidth variant="outlined" value={name} onChange={handleNameChange}></TextField>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Chiều dài
                                </TableCell>
                                <TableCell>
                                    <Slider
                                        size="medium"
                                        defaultValue={70}
                                        aria-label="Small"
                                        valueLabelDisplay="auto"
                                        marks={marks}
                                        min={20}
                                        max={100}
                                        value={length}
                                        onChange={handleLengthChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField fullWidth variant="standard" value={length} onChange={handleLengthChange}></TextField>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Chiều rộng
                                </TableCell>
                                <TableCell>
                                    <Slider
                                        size="medium"
                                        value={width}
                                        defaultValue={70}
                                        aria-label="Small"
                                        valueLabelDisplay="auto"
                                        marks={marks}
                                        min={20}
                                        max={100}
                                        onChange={handleWidthChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField fullWidth variant="standard" value={width} onChange={handleWidthChange}></TextField>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Chiều cao
                                </TableCell>
                                <TableCell>
                                    <Slider
                                        size="medium"
                                        defaultValue={70}
                                        aria-label="Small"
                                        valueLabelDisplay="auto"
                                        marks={marks}
                                        min={20}
                                        max={100}
                                        onChange={handleHeightChange}
                                        value={height}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField fullWidth variant="standard" value={height} onChange={handleHeightChange}></TextField>
                                </TableCell>
                            </TableRow>
                            {selectedShape.trim() == "LS" && (
                                <>
                                    <TableRow>
                                        <TableCell>
                                            Độ phồng (%)
                                        </TableCell>
                                        <TableCell>
                                            <Slider
                                                size="medium"
                                                defaultValue={70}
                                                aria-label="Small"
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={50}
                                                value={inflateLevel}
                                                onChange={handleInflateLevelChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField fullWidth variant="standard" value={inflateLevel} onChange={handleInflateLevelChange}></TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Vị trí phồng<br></br> (0 - tại nắp;<br></br> 100 - tại đế)
                                        </TableCell>
                                        <TableCell>
                                            <Slider
                                                size="medium"
                                                defaultValue={50}
                                                aria-label="Small"
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={100}
                                                value={inflatePos}
                                                onChange={handleInflatePosChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField fullWidth variant="standard" value={inflatePos} onChange={handleInflatePosChange}></TextField>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                            {(selectedShape.trim() == "LV" || selectedShape.trim() == "LG") &&(
                                <>
                                    <TableRow>
                                        <TableCell>Họa tiết đường viền</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={outlinePattern} onChange={handleOutlinePatternChange}>
                                                <MenuItem value={31}>Không họa tiết</MenuItem>
                                                {
                                                    patternList.map((pattern) => (
                                                        <MenuItem key={pattern.Id} value={pattern.Id}>
                                                            {pattern.Picture && <img className="w-16 h-16 mr-4" src={pattern.Picture} alt={pattern.Name} />}
                                                            {!pattern.Picture && <Icon />}
                                                            {pattern.Name }
                                                        </MenuItem>
                                                    ))
                                                }
                                                <MenuItem value={1}>Tùy chỉnh</MenuItem>
                                            </TextField>
                                            {outlinePattern == 1 && (
                                                <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
                                                    <div>
                                                        Upload ảnh họa tiết của bạn
                                                        <ImageUploader
                                                            images={custom_outline_img}
                                                            setImages={set_custom_outline_img}
                                                            maxNumber={1}
                                                        />
                                                    </div>
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            label="Mô tả để chúng tôi nắm rõ hơn"
                                                            multiline
                                                            rows={6}
                                                            value={custom_outline_desc} onChange={handleOutlineDescChange}
                                                        ></TextField>
                                                    </div>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Họa tiết góc</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={cornerPattern} onChange={handleCornerPatternChange}>
                                                <MenuItem value={31}>Không họa tiết</MenuItem>
                                                {
                                                    patternList.map((pattern) => (
                                                        <MenuItem key={pattern.Id} value={pattern.Id}>
                                                            {pattern.Picture && <img className="w-16 h-16 mr-4" src={pattern.Picture} alt={pattern.Name} />}
                                                            {!pattern.Picture && <Icon />}
                                                            {pattern.Name}
                                                        </MenuItem>
                                                    ))
                                                }
                                                <MenuItem value={1}>Tùy chỉnh</MenuItem>
                                            </TextField>
                                            {cornerPattern == 1 && (
                                                <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
                                                    <div>
                                                        Upload ảnh họa tiết của bạn
                                                        <ImageUploader
                                                            images={custom_corner_img}
                                                            setImages={set_custom_corner_img}
                                                            maxNumber={1}
                                                        />
                                                    </div>
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            label="Mô tả để chúng tôi nắm rõ hơn"
                                                            multiline
                                                            rows={6}
                                                            value={custom_corner_desc} onChange={handleCornerDescChange}
                                                        ></TextField>
                                                    </div>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                            </TableBody>
                    </Table>
                    <Table>
                        <TableRow>
                            <TableCell className="mr-4">Loại chim áp dụng</TableCell>
                            <TableCell>
                                <TextField fullWidth className="w-1/2" variant="outlined" label="Vd: Chào mào, chích chòe, v.v..." value={birdType} onChange={handleBirdTypeChange}></TextField>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="mr-4">Chất liệu</TableCell>
                            <TableCell>
                                <TextField select fullWidth className="w-1/2" variant="filled" value={material} onChange={handleMaterialChange}>
                                    <MenuItem value={31}>Chọn chất liệu</MenuItem>
                                    {
                                        materialList.map((m) => (
                                            <MenuItem key={m.ID} value={m.ID }>{m.Name }</MenuItem>
                                        ))
                                    }
                                </TextField>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="mr-4">Màu Sắc</TableCell>
                            <TableCell>
                                {isColorAll && <input className="w-48 h-16" type="color" value={color} onChange={handleColorChange }></input>}
                                <Checkbox checked={isColorAll} onChange={(event) => setIsColorAll(event.target.checked)} /> Sơn màu
                            </TableCell>
                        </TableRow>
                    </Table>
                </div>
                <div className="mt-8 ml-6 font-bold text-xl bg-slate-200 p-4">Móc lồng</div>
                <div className="text-xl">
                    <Checkbox checked={customHook} onChange={(event) => setCustomHook(event.target.checked)} /> Custom móc lồng
                    {customHook && (
                        <div className="ml-6 w-1/2">
                            <Table>
                                <colgroup>
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '70%' }} />
                                    <col style={{ width: '10%' }} />
                                </colgroup>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            Kích thước
                                        </TableCell>
                                        <TableCell>
                                            <Slider
                                                size="medium"
                                                aria-label="Small"
                                                valueLabelDisplay="auto"
                                                min={5}
                                                max={40}
                                                onChange={handleHookHeightChange}
                                                value={hook_height}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField fullWidth variant="standard" value={hook_height} onChange={handleHookHeightChange}></TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Kiểu cách</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={hookStyle} onChange={handleHookStyleChange}>
                                                <MenuItem value={31}>Chọn kiểu</MenuItem>
                                                {
                                                    hookStyleList.map((style) => (
                                                        <MenuItem key={style.Id} value={style.Id}>
                                                            {style.Picture && <img className="w-16 h-16 mr-4" src={style.Picture} alt={style.Name} />}
                                                            {!style.Picture && <Icon />}
                                                            {style.Name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Họa tiết trang trí</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={hookPattern} onChange={handleCustomPatternHookChange}>
                                                <MenuItem value={31}>Không họa tiết</MenuItem>
                                                {
                                                    patternList.map((pattern) => (
                                                        <MenuItem key={pattern.Id} value={pattern.Id}>
                                                            {pattern.Picture && <img className="w-16 h-16 mr-4" src={pattern.Picture} alt={pattern.Name} />}
                                                            {!pattern.Picture && <Icon />}
                                                            {pattern.Name}
                                                        </MenuItem>
                                                    ))
                                                }
                                                <MenuItem value={1}>Tùy chỉnh</MenuItem>
                                            </TextField>
                                            {isCustomPatternHook && (
                                                <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
                                                    <div>
                                                        Upload ảnh họa tiết của bạn
                                                        <ImageUploader
                                                            images={hook_pattern_image}
                                                            setImages={set_hook_pattern_image}
                                                            maxNumber={1}
                                                        />
                                                    </div>
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            label="Mô tả để chúng tôi nắm rõ hơn"
                                                            multiline
                                                            rows={6}
                                                            value={hookPatternDesc} onChange={handleHookPatternDescChange}
                                                        ></TextField>
                                                    </div>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Chất liệu</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={hookMaterial} onChange={handleHookMaterialChange}>
                                                <MenuItem value={31}>Cùng chất liệu với lồng</MenuItem>
                                                {
                                                    materialList.map((material) => (
                                                        <MenuItem key={material.ID} value={material.ID}>{material.Name}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Màu Sắc</TableCell>
                                        <TableCell>
                                            {isColorHook && <input className="w-48 h-16" type="color" value={hookColor} onChange={handleHookColorChange}></input>}
                                            <Checkbox checked={isColorHook} onChange={(event) => setIsColorHook(event.target.checked)} />Sơn màu
                                        </TableCell>
                                        <TableCell><Button>Mặc định</Button></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
                <div className="mt-8 ml-6 font-bold text-xl bg-slate-200 p-4">Nan lồng</div>
                <div className="text-xl">
                    <Checkbox checked={customSpoke} onChange={(event) => setCustomSpoke(event.target.checked)} />  Custom nan lồng
                    {customSpoke && (
                        <div className="ml-6 w-1/2">
                            <Table>
                                <colgroup>
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '70%' }} />
                                    <col style={{ width: '10%' }} />
                                </colgroup>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            Số nan dọc
                                        </TableCell>
                                        <TableCell>
                                            <Slider
                                                size="medium"
                                                aria-label="Small"
                                                valueLabelDisplay="auto"
                                                min={16}
                                                max={128}
                                                onChange={handleSpokeNumVerChange}
                                                value={spoke_number_ver}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField fullWidth variant="standard" value={spoke_number_ver} onChange={handleSpokeNumVerChange}></TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Số nan ngang
                                        </TableCell>
                                        <TableCell>
                                            <Slider
                                                size="medium"
                                                aria-label="Small"
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={32}
                                                onChange={handleSpokeNumHorChange}
                                                value={spoke_number_hor}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField fullWidth variant="standard" value={spoke_number_hor} onChange={handleSpokeNumHorChange}></TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Chất liệu</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={spokeMaterial} onChange={handleSpokeMaterialChange}>
                                                <MenuItem value={31}>Cùng chất liệu với lồng</MenuItem>
                                                {
                                                    materialList.map((material) => (
                                                        <MenuItem key={material.ID} value={material.ID}>{material.Name}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Màu Sắc</TableCell>
                                        <TableCell>
                                            {isColorSpoke && <input className="w-48 h-16" type="color" value={spokeColor} onChange={handleSpokeColorChange}></input>}
                                            <Checkbox checked={isColorSpoke}  onChange={(event) => setIsColorSpoke(event.target.checked)} />Sơn màu
                                        </TableCell>
                                        <TableCell><Button>Mặc định</Button></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
                <div className="mt-8 ml-6 font-bold text-xl bg-slate-200 p-4">Cửa lồng</div>
                    <div className="text-xl">
                    <Checkbox checked={customDoor} onChange={(event) => setCustomDoor(event.target.checked)} /> Custom cửa lồng
                    {customDoor && (
                        <div className="ml-6 w-1/2">
                            <Table>
                                <colgroup>
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '70%' }} />
                                    <col style={{ width: '10%' }} />
                                </colgroup>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            Chiều ngang
                                        </TableCell>
                                        <TableCell>
                                            <Slider
                                                size="medium"
                                                defaultValue={70}
                                                aria-label="Small"
                                                valueLabelDisplay="auto"
                                                min={length * 0.05}
                                                max={length*0.8}
                                                onChange={handleDoorWidthChange}
                                                value={door_width}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField fullWidth variant="standard" value={door_width} onChange={handleDoorWidthChange}></TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Chiều dọc
                                        </TableCell>
                                        <TableCell>
                                            <Slider
                                                size="medium"
                                                defaultValue={70}
                                                aria-label="Small"
                                                valueLabelDisplay="auto"
                                                min={height * 0.05}
                                                max={height * 0.8}
                                                onChange={handleDoorHeightChange}
                                                value={door_height}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField fullWidth variant="standard" value={door_height} onChange={handleDoorHeightChange}></TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Kiểu cách</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={doorStyle} onChange={handleDoorStyleChange}>
                                                <MenuItem value={31}>Chọn kiểu</MenuItem>
                                                {
                                                    doorStyleList.map((style) => (
                                                        <MenuItem key={style.Id} value={style.Id}>
                                                            {style.Picture && <img className="w-16 h-16 mr-4" src={style.Picture} alt={style.Name} />}
                                                            {!style.Picture && <Icon />}
                                                            {style.Name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Cơ chế</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={doorMode}
                                                disabled={isSwordDoor} onChange={handleDoorModeChange}>
                                                <MenuItem value={31}>Chọn cơ chế</MenuItem>
                                                {
                                                    doorModeList.map((mode) => (
                                                        <MenuItem key={mode.Id} value={mode.Id}>{mode.Name}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Họa tiết trang trí</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={doorPattern} onChange={handleCustomPatternDoorChange}>
                                                <MenuItem value={31}>Không họa tiết</MenuItem>
                                                {
                                                    patternList.map((pattern) => (
                                                        <MenuItem key={pattern.Id} value={pattern.Id}>
                                                            {pattern.Picture && <img className="w-16 h-16 mr-4" src={pattern.Picture} alt={pattern.Name} />}
                                                            {!pattern.Picture && <Icon />}
                                                            {pattern.Name}
                                                        </MenuItem>
                                                    ))
                                                }
                                                <MenuItem value={1}>Tùy chỉnh</MenuItem>
                                            </TextField>
                                            {isCustomPatternDoor && (
                                                <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
                                                    <div>
                                                        Upload ảnh họa tiết của bạn
                                                        <ImageUploader
                                                            images={door_pattern_image}
                                                            setImages={set_door_pattern_image}
                                                            maxNumber={1}
                                                        />
                                                    </div>
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            label="Mô tả để chúng tôi nắm rõ hơn"
                                                            multiline
                                                            rows={6}
                                                            value={doorPatternDesc} onChange={handleDoorPatternDescChange}
                                                        ></TextField>
                                                    </div>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Chất liệu</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={doorMaterial} onChange={handleDoorMaterialChange}>
                                                <MenuItem value={31}>Cùng chất liệu với lồng</MenuItem>
                                                {
                                                    materialList.map((material) => (
                                                        <MenuItem key={material.ID} value={material.ID}>{material.Name}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Màu Sắc</TableCell>
                                        <TableCell>
                                            {isColorDoor && <input className="w-48 h-16" type="color" value={doorColor} onChange={handleDoorColorChange}></input>}
                                            <Checkbox checked={isColorDoor} onChange={(event) => setIsColorDoor(event.target.checked)} />Sơn màu
                                        </TableCell>
                                        <TableCell><Button>Mặc định</Button></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
                <div className="mt-8 ml-6 font-bold text-xl bg-slate-200 p-4">Nắp lồng</div>
                <div className="text-xl">
                    <Checkbox checked={customTop} onChange={(event) => setCustomTop(event.target.checked)} />  Custom nắp lồng
                    {customTop && (
                        <div className="ml-6 w-1/2">
                            <Table>
                                <colgroup>
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '70%' }} />
                                    <col style={{ width: '10%' }} />
                                </colgroup>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Kiểu cách</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={topStyle} onChange={handleTopStyleChange}>
                                                <MenuItem value={31}>Chọn kiểu</MenuItem>
                                                {
                                                    topStyleList.map((style) => (
                                                        <MenuItem key={style.Id} value={style.Id}>
                                                            {style.Picture && <img className="w-16 h-16 mr-4" src={style.Picture} alt={style.Name} />}
                                                            {!style.Picture && <Icon />}
                                                            {style.Name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Họa tiết trang trí</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={topPattern} onChange={handleCustomPatternTopChange}>
                                                <MenuItem value={31}>Không họa tiết</MenuItem>
                                                {
                                                    patternList.map((pattern) => (
                                                        <MenuItem key={pattern.Id} value={pattern.Id}>
                                                            {pattern.Picture && <img className="w-16 h-16 mr-4" src={pattern.Picture} alt={pattern.Name} />}
                                                            {!pattern.Picture && <Icon />}
                                                            {pattern.Name}
                                                        </MenuItem>
                                                    ))
                                                }
                                                <MenuItem value={1}>Tùy chỉnh</MenuItem>
                                            </TextField>
                                            {isCustomPatternTop && (
                                                <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
                                                    <div>
                                                        Upload ảnh họa tiết của bạn
                                                        <ImageUploader
                                                            images={top_pattern_image}
                                                            setImages={set_top_pattern_image}
                                                            maxNumber={1}
                                                        />
                                                    </div>
                                                    <div>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            label="Mô tả để chúng tôi nắm rõ hơn"
                                                            multiline
                                                            rows={6}
                                                            value={topPatternDesc} onChange={handleTopPatternDescChange}
                                                        ></TextField>
                                                    </div>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Chất liệu</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={topMaterial} onChange={handleTopMaterialChange}>
                                                <MenuItem value={31}>Cùng chất liệu với lồng</MenuItem>
                                                {
                                                    materialList.map((material) => (
                                                        <MenuItem key={material.ID} value={material.ID}>{material.Name}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Màu Sắc</TableCell>
                                        <TableCell>
                                            {isColorTop && <input className="w-48 h-16" type="color" value={topColor} onChange={handleTopColorChange}></input>}
                                            <Checkbox checked={isColorTop} onChange={(event) => setIsColorTop(event.target.checked)} />Sơn màu
                                        </TableCell>
                                        <TableCell><Button>Mặc định</Button></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
                <div className="mt-8 ml-6 font-bold text-xl bg-slate-200 p-4">Đế lồng</div>
                <div className="text-xl">   
                    <Checkbox checked={customBottom} onChange={(event) => setCustomBottom(event.target.checked)} />  Custom đế lồng
                    {customBottom && (
                        <div className="ml-6 w-1/2">
                            <Table>
                                <colgroup>
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '70%' }} />
                                    <col style={{ width: '10%' }} />
                                </colgroup>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Kiểu cách</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={bottomStyle} onChange={handleBottomStyleChange}>
                                                <MenuItem value={31}>Chọn kiểu</MenuItem>
                                                {
                                                    botStyleList.map((style) => (
                                                        <MenuItem key={style.Id} value={style.Id}>
                                                            {style.Picture && <img className="w-16 h-16 mr-4" src={style.Picture} alt={style.Name} />}
                                                            {!style.Picture && <Icon />}
                                                            {style.Name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Họa tiết trang trí</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={bottomPattern} onChange={handleCustomPatternBotChange}>
                                                <MenuItem value={31}>Không họa tiết</MenuItem>
                                                {
                                                    patternList.map((pattern) => (
                                                        <MenuItem key={pattern.Id} value={pattern.Id}>
                                                            {pattern.Picture && <img className="w-16 h-16 mr-4" src={pattern.Picture} alt={pattern.Name} />}
                                                            {!pattern.Picture && <Icon />}
                                                            {pattern.Name}
                                                        </MenuItem>
                                                    ))
                                                }
                                                <MenuItem value={1}>Tùy chỉnh</MenuItem>
                                            </TextField>
                                            {isCustomPatternBot && (
                                            <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
                                                <div>
                                                    Upload ảnh họa tiết của bạn
                                                    <ImageUploader
                                                        images={bottom_pattern_image}
                                                        setImages={set_bottom_pattern_image}
                                                        maxNumber={1}
                                                    />
                                                </div>
                                                <div>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        label="Mô tả để chúng tôi nắm rõ hơn"
                                                        multiline
                                                        rows={6}
                                                        value={bottomPatternDesc} onChange={handleBottomPatternDescChange}
                                                    ></TextField>
                                                </div>
                                            </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Chất liệu</TableCell>
                                        <TableCell>
                                            <TextField select fullWidth className="w-1/2" variant="filled" defaultValue={bottomMaterial} onChange={handleBottomMaterialChange}>
                                                <MenuItem value={31}>Cùng chất liệu với lồng</MenuItem>
                                                {
                                                    materialList.map((material) => (
                                                        <MenuItem key={material.ID} value={material.ID}>{material.Name}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Màu Sắc</TableCell>
                                        <TableCell>
                                            {isColorBot && <input className="w-48 h-16" type="color" value={bottomColor} onChange={handleBottomColorChange}></input>}
                                            <Checkbox checked={isColorBot} onChange={(event) => setIsColorBot(event.target.checked)} />Sơn màu
                                        </TableCell>
                                        <TableCell><Button>Mặc định</Button></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Góc nghiêng (Độ)
                                        </TableCell>
                                        <TableCell>
                                            <Slider
                                                size="medium"
                                                aria-label="Small"
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={45}
                                                value={bottomTilt}
                                                onChange={handleBottomTiltChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField fullWidth variant="standard" value={bottomTilt} onChange={handleBottomTiltChange}></TextField>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
                <div className="mt-8 ml-6 font-bold text-xl bg-slate-200 p-4">Mô tả khác</div>
                <div className="ml-8 mb-8 mt-8 w-1/2">
                    Mức độ chi tiết, tỉ mỉ
                    <Slider
                        size="medium"
                        aria-label="Small"
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        value={detailLevel}
                        onChange={handleDetailLevelChange}
                    />
                    <div className="italic mb-4">(Lưu ý : Độ tỉ mỉ càng cao thì giá tiền sẽ càng nhiều và thời gian để chế tạo sẽ càng lớn và ngược lại)</div>
                    <TextField fullWidth className="w-1/2" variant="outlined" label="Mô tả khác" multiline
                        rows={6} value={otherDesc} onChange={handleOtherDescriptionChange}></TextField>
                </div>  
                <div className="bg-gray-200">
                    <div className="flex justify-end">
                        <div className="mr-4">
                            <Button variant="outlined" onClick={() => {
                                calaculatePrice(); calaculateWork()
                            }}><RefreshIcon /></Button>
                        </div>
                        <div className=" text-lg font-bold mr-8">Giá cả ước tính :</div>
                        <div className="text-4xl font-bold text-red-500 mr-4">
                            {(estimatedPrice).toLocaleString('vi', {
                                style: 'currency',
                                currency: 'VND'
                            })}
                        </div>
                    </div>                  
                    <div className="flex justify-end">
                        <div className=" text-lg font-bold mr-8">Số ngày dự tính hoàn thành:</div>
                        <div className="text-4xl font-bold text-blue-500 mr-4">
                            {estimatedWork}
                        </div>
                    </div> 

                    <div className="flex justify-end mr-4 mt-8 pb-8">
                        <Button className="w-64 h-16" variant="outlined" onClick={resetState}>
                            <div className="font-bold text-2xl">Reset</div>
                        </Button>
                        <Button className="w-64 h-16" variant="outlined" onClick={() => handleSaveDraft(true)}>
                            <div className="font-bold text-2xl">Lưu bản nháp</div>
                        </Button>
                        {id ? (
                            <Button className="w-64 h-16" variant="contained"
                                onClick={handleConfirm}>
                                <div className="font-bold text-2xl">Cập nhật</div>
                            </Button>
                        ) : (
                             <Button className="w-64 h-16" variant="contained"
                                 onClick={handleConfirm}>
                                    <div className="font-bold text-2xl">Đặt hàng</div>
                            </Button>
                        ) }
                        
                    </div>
                </div>
                <Popup
                    open={isPopup}
                    modal
                    position="right-center"
                    onClose={() => setPopup(false)}
                >
                    <div className="bg-gray-200">
                        <div className="flex justify-center text-4xl font-bold">
                            Xác nhận đơn hàng
                        </div>
                        <div className="flex justify-center mt-4">
                            <div className=" text-lg font-bold mr-8">Giá cả ước tính</div>
                            
                        </div>
                        <div className="flex justify-center mt-2">
                            <div className="text-5xl font-bold text-red-500 mr-4">
                                    {(estimatedPrice).toLocaleString('vi', {
                                        style: 'currency',
                                        currency: 'VND'
                                    })}
                            </div>
                        </div>
                        <div className="flex justify-center text-lg font-bold mr-8">Chiếc lồng của bạn dự tính sẽ hoàn thành trong
                            <div className="text-4xl font-bold text-blue-500 mr-4 ml-4">
                                {estimatedWork}
                            </div>
                            ngày
                        </div>
                        <div className="italic mt-4 ml-4">
                            Sau khi bạn xác nhận, yêu cầu lồng Custom của bạn sẽ được đội ngũ nhân viên xem xét
                            duyệt đơn và bắt đầu chế tạo, bạn có thể thanh toán vào lúc này. Shop sẽ gửi cho bạn cập
                            nhật về chiếc lồng và sẽ gửi hình ảnh của nó một khi đã hoàn thành
                        </div>
                        <div className="italic mt-4 ml-4">
                            Lưu ý rằng giá cả và thời gian hoàn thiện trên chỉ là dự tính và có thể thay đổi khi
                            nhân viên duyệt đơn
                        </div>
                        <div className="italic mt-4 ml-4">
                            Sau khi đặt hàng, hãy tới mục Đơn mua Custom trong hồ sơ cá nhân để nhận được thông tin mới
                            nhất về đơn hàng này nhé. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                        </div>
                        <div className="flex justify-center mt-8 pb-8 ">
                            <Button className="w-64 h-16" variant="contained"
                                onClick={() => { setPopup(false); uploadToHost(0) }}>
                                <div className="font-bold text-2xl">Đặt hàng</div>
                            </Button>
                        </div>
                    </div>
                </Popup>
            </div>
        </div>
    )
}
