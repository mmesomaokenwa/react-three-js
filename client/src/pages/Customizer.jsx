import React, { useState, useEffect } from 'react'
import { useSnapshot } from "valtio";
import { state } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import config from "../config/config";
import { download } from '../assets'
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from "../config/motion";
import { AIPicker, ColorPicker, FilePicker, Tab, CustomButton } from '../components';
import Toast from '../components/Toast';

const Customizer = () => {
  const snap = useSnapshot(state)

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    type: '',
  })

  const [file, setFile] = useState('')

  const [prompt, setPrompt] = useState('')
  // Reset the editor to its default state
  const [generatingImg, setGeneratingImg] = useState(false)

  const [activeEditorTab, setActiveEditorTab] = useState('')

  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })

  const generateTabContent = () => {
    if (activeEditorTab === 'colorpicker') {
      return <ColorPicker />
    } else if (activeEditorTab === 'filepicker') {
      return <FilePicker
        file={file}
        setFile={setFile}
        readFile={readFile}
      />
    } else if (activeEditorTab === 'aipicker') {
      return <AIPicker
        prompt={prompt}
        setPrompt={setPrompt}
        generatingImg={generatingImg}
        handleSubmit={handleSubmit}
      />
    } else return null
  }

  const handleActiveFilterTab = (tabName) => {
    if (tabName === 'logoShirt') {
      state.isLogoTexture = !state.isLogoTexture
    } else if (tabName === 'stylishShirt') {
      state.isFullTexture = !state.isFullTexture
    } 
    // else {
    //   state[tabName] = !state[tabName]
    // }
    setActiveFilterTab(prevState => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type]
    state[decalType.stateProperty] = result
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const readFile = async (type) => {
    const result = await reader(file)
    if (result) {
      handleDecals(type, result)
      setActiveEditorTab('')
    }
  }

  const handleSubmit = async (type) => {
    if (!prompt) return setAlert({
      open: true,
      message: 'Please enter a prompt',
      type: 'error',
    })
    
    try {
      setGeneratingImg(true)
      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt
        })
      })
      if (!response.ok) throw new Error('Something went wrong')

      const data = await response.json()
      handleDecals(type, `data:image/png;base64,${data.photo}`)
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: 'error',
      })
    } finally {
      setGeneratingImg(false)
      setActiveEditorTab('')
    }
  }

  const handleActiveEditorTab = (tabName) => {
    if (activeEditorTab !== tabName) return setActiveEditorTab(tabName)
    setActiveEditorTab('')
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => handleActiveEditorTab(tab.name)}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab={true}
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
            <button className="download-btn" onClick={downloadCanvasToImage}>
              <img
                src={download}
                alt="download_image"
                className="w-3/5 h-3/5 object-contain"
              />
            </button>
          </motion.div>
          {alert.open && (
            <motion.div
              className="absolute z-50 top-5 left-5 right-5 mx-auto lg:w-[350px]"
              {...slideAnimation("down")}
            >
              <Toast {...alert} setAlert={setAlert} />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

export default Customizer