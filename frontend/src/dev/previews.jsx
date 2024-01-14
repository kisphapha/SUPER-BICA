import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Cart from "../Pages/Cart/index.jsx";
import ProductDetails from "../Pages/ProductDetail/index.jsx";
import Order from "../Pages/Admin/Order/index.jsx";
import Policy from "../Pages/Policy/MainPolicy/MainPolicy.jsx";
import CardList from "../components/features/CardList/index.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Cart">
                <Cart/>
            </ComponentPreview>
            <ComponentPreview path="/ProductDetails">
                <ProductDetails/>
            </ComponentPreview>
            <ComponentPreview path="/Order">
                <Order/>
            </ComponentPreview>
            <ComponentPreview path="/Policy">
                <Policy/>
            </ComponentPreview>
            <ComponentPreview path="/CardList">
                <CardList/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews