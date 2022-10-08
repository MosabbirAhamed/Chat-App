import React, { useState } from 'react'
import useStorage from '../hooks/useStorage';


const UploadFiles = () => {

    const [image, setImage] = useState(null);
    const [upload, progress, url, error, getPreview] = useStorage('image/')

    const handleChange = (e) => {
        setImage(e.target.files[0])
    }
    const uploadFiles = () => {
        upload(image)
    }

    return (
        <div>

            {image && <img src={getPreview(image)} alt="Preview" />}

            <input type="file" accept="image/*" onChange={handleChange} />

            <br />

            {error && "ERROR:" + error}

            <br />
            <button onClick={uploadFiles} >upload</button>
            {url && <img src={url} alt="" />}

        </div>
    )
}

export default UploadFiles