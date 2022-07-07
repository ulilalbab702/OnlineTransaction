import React, { useState } from "react";
import "./ModalUpload.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { IconFile, IconFileAdd, IconCSV, IconPDF, IconUploadFile, IconUpload } from "assets/icons";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";

const ModalUpload = ({ isOpen, isClose, token, submit, download, upload, nameFile, cancel }) => {
  const [selectedTab, setTab] = useState(0);

  const onClick = (option) => {
    if (option === selectedTab) setTab(0);
    else setTab(option);
  };

  const renderTab = () => {
    return (
      <div className='container-tab'>
        <div className='header-tab'>
          <p className={selectedTab === 0 ? 'title-tab-upload-click' : 'title-tab-upload'} style={{ cursor: 'pointer' }} onClick={() => onClick(0)}>
            Download Template
          </p>
          <div
            className='footer-tab'
            style={selectedTab === 0 ? { borderBottom: "3px solid #ffd500" } : { borderBottom: "1px solid #f1f1f1" }}
          />
        </div>
        <div className='header-tab'>
          <p className={selectedTab === 1 ? 'title-tab-upload-click' : 'title-tab-upload'} style={{ cursor: 'pointer' }} onClick={() => onClick(1)}>
            Upload File
          </p>
          <div
            className='footer-tab'
            style={selectedTab === 1 ? { borderBottom: "3px solid #ffd500" } : { borderBottom: "1px solid #f1f1f1" }}
          />
        </div>
      </div>
    );
  };

  const renderAttachCsv = () => {
    if (nameFile != '')
      return (
        <div style={{ marginTop: 10, marginBottom: 10, }}>
          <div className='header-file-upload'>
            <img src={IconCSV} className='icon-file' />
            <div style={{ flexDirection: "column", flex: 1 }}>
              <div className='header-file-upload'>
                <div style={{ flex: 1 }}>
                  <p className='title-name-file'>{nameFile}</p>
                </div>
                <div className='header-progress'>
                  <p className='title-name-file'>100 %</p>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <Progress percent={100} status='success' />
              </div>
            </div>
          </div>
        </div>
      );
  };


  return (
    <Modal className='modal-upload' open={isOpen} onClose={isClose}>
      <DialogContent className='container-modal-upload'>
        <div className='upload-modal-body'>
          <p className='titleUpload'>Upload Item</p>
          {renderTab()}
          <div className='card-download'>
            <img className='imageUpload' src={selectedTab === 0 ? IconFile : IconUploadFile} />
            {selectedTab === 1 ?
              <input id='uploadCsv' hidden type='file' onChange={() => upload()} /> : null
            }

            <div style={{ cursor: 'pointer' }} className='btn-download' onClick={() => { selectedTab === 0 ? download() : upload() }}>
              <img src={IconFileAdd} className='icon-file' />
              <p className='titleButtonDownload' style={{ fontFamily: "SFProText-Bold" }}> {selectedTab === 0 ? "Download File" : "Pilih File"}</p>
            </div>
          </div>
          {selectedTab === 1 ? renderAttachCsv() : null}

          {selectedTab === 1 ?
            <div className='row-button-upload'>
              <div className='cardCancel' style={{ cursor: 'pointer' }} onClick={() => cancel()}>
                <p className='textBuy'>Batal</p>
              </div>
              <div className='cardSubmit' style={{ cursor: 'pointer' }} onClick={() => submit()}>
                <p className='textBuy'>Kirim</p>
              </div>
            </div>
            : null}
        </div>
      </DialogContent>
    </Modal>
  );
};

export default ModalUpload;
