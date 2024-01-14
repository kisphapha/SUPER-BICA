const Material = require("../models/Material");


const getAllMaterial = async(req, res) => {
    try {
        const response = await Material.getAllMaterial();
        res.json(response);
    }catch (e) {
        res.status(500).json({message: e.message})
    }
}
const getMaterialForCustom = async (req, res) => {
    try {
        const response = await Material.getMaterialForCustom();
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const getMaterialByCate = async (req, res) => {
    try {
        const cate = req.params.Cate
        const response = await Material.getMaterialByCate(cate);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const addMaterial = async (req, res) => {
    try {
        const name = req.body.name
        const cate = req.body.cate
        const price = req.body.price
        const unit = req.body.unit
        const allow_customize = req.body.customize
        const response = await Material.addMaterial(name, cate, price, unit, allow_customize);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const updateMaterial  = async (req, res) => {
    try {
        const id = req.body.id
        const name = req.body.name
        const cate = req.body.cate
        const price = req.body.price
        const unit = req.body.unit
        const allow_customize = req.body.customize
        const response = await Material.updateMaterial(id, name, cate, price, unit, allow_customize);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const deleteMaterial = async (req, res) => {
    try {
        const id = req.params.id
        const response = await Material.deleteMaterial(id);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
const filterMaterial = async (req, res) => {
    try {
        const name = req.body.name
        const cate = req.body.cate
        const unit = req.body.unit
        const allow_customize = req.body.customize
        const page = req.body.page
        const response = await Material.filterMaterial( name, cate, unit, allow_customize,page);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
module.exports = {
    getAllMaterial,
    getMaterialByCate,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    filterMaterial,
    getMaterialForCustom
}