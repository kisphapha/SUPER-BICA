import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './styles.css'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import ImageUploading from 'react-images-uploading';
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete'


export default function ImageUploader({ images, setImages, maxNumber, setChangedPicture }) {
    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
        setChangedPicture(true)
    };


    return (
        <div>
            <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) => (
                    // write your building UI
                    <div>
                        <Button
                            variant="outlined"
                            style={isDragging ? { color: 'red' } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                        >
                            Chọn Ảnh
                        </Button>
                        &nbsp;
                        <Button variant="outlined" onClick={onImageRemoveAll}><DeleteIcon/></Button>
                        <div className="flex flex-wrap">
                            {imageList.map((image, index) => (
                                <div key={index} className="image-item p-2">
                                    <img src={image.data_url} alt="" className="object-fit w-24 h-24" />
                                    <div className="image-item__btn-wrapper mt-2">
                                        <Button onClick={() => onImageUpdate(index)}>Update</Button>
                                        <Button onClick={() => onImageRemove(index)}><DeleteIcon/></Button>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                )}
            </ImageUploading>
        </div>
    )
}
