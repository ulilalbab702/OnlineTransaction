import React, { useState } from "react";
import "./ModalRating.scss";
import { Modal, DialogContent } from "@material-ui/core";
import { Star, StarGray, IconUser } from "assets/icons";
import iconPerson from "assets/icons/person.png";

const ModalRating = ({ isOpen, isClose, onSubmit, user, isLoading }) => {
  const [review, setReview] = useState("");
  const [rate, setRate] = useState(0);
  const [name, setName] = useState(user.firstName);
  const [hide, setHide] = useState(false);

  var ratings = [{ status: false }, { status: false }, { status: false }, { status: false }, { status: false }];
  switch (rate) {
    case 1:
      ratings = [{ status: true }, { status: false }, { status: false }, { status: false }, { status: false }];
      break;
    case 2:
      ratings = [{ status: true }, { status: true }, { status: false }, { status: false }, { status: false }];
      break;
    case 3:
      ratings = [{ status: true }, { status: true }, { status: true }, { status: false }, { status: false }];
      break;
    case 4:
      ratings = [{ status: true }, { status: true }, { status: true }, { status: true }, { status: false }];
      break;
    case 5:
      ratings = [{ status: true }, { status: true }, { status: true }, { status: true }, { status: true }];
      break;
    default:
      ratings = [{ status: false }, { status: false }, { status: false }, { status: false }, { status: false }];
  }

  const _handleHide = () => {
    if (hide == false) {
      setName(`${user.firstName.slice(0, 1)}********`);
      setHide(true);
    } else {
      setName(`${user.firstName}`);
      setHide(false);
    }
  };

  return (
    <Modal className='modal-upload' open={isOpen} onClose={isClose}>
      <DialogContent className="container-modal-rating">
        <div className="container-rating">
          <p className="title-rating">Beri Nilai</p>
          <div style={{ display: 'flex', flexDirection: 'row', margin: '30px 0' }}>
            {ratings.map((rat, index) => (
              <img
                src={rat.status ? Star : StarGray}
                alt="starRating"
                key={index}
                onClick={() => (setRate(index + 1))}
              />
            ))}
          </div>
          <p className="text-review">
            ULASAN
          </p>
          <input
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Berikan ulasan"
            className="form-review"
          />
          <p className="text-review">
            {"Sembunyikan Nama & Profil"}
          </p>
          <div style={{
            display: "flex",
            alignItems: "center"
          }}>
            {hide ? 
            <>
              <div className="imgUser" style={{ backgroundColor: "#FFD500", display: 'flex' }}>
                <img src={iconPerson} style={{width: '60%', height: '60%'}}/>
              </div>
              <span className="username">{name}</span>
            </> :
            <>
              <div className="imgUser" style={{ backgroundColor: "#FFD500", display: 'flex' }}>
                <span 
                  className="username"
                  style={{ margin: 'auto', fontSize: 26 }}
                >{user.firstName.slice(0, 1).toUpperCase()}</span>
              </div>
              <span className="username">{user.firstName}</span>
            </>}
            <div 
              className={hide ? "conSwitchActive" : "conSwitch"}
              onClick={() => _handleHide()}
            >
              <div className="switch" />
            </div>
          </div>
          <div className="con-btn-rating">
            <div className="btn-cancle-rating" onClick={isClose}>
              <p className="title-confirm">Kembali</p>
            </div>
            {isLoading ?
            <div className="btn-confirm-rating">
              <p className="title-confirm">Loading...</p>
            </div> :
            <div className="btn-confirm-rating" onClick={() => onSubmit(rate, review, hide)}>
              <p className="title-confirm">Kirim</p>
            </div>}
          </div>
        </div>
      </DialogContent>
    </Modal>
  );
};

export default ModalRating;