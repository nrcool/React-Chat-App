
import React, { useRef } from 'react';
import "./Contact.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { init,sendForm } from 'emailjs-com';

import toast, { Toaster } from 'react-hot-toast';
function Contact() {
  init(process.env.REACT_APP_USER_ID);
  const formRef=useRef()

  const sendEmail = (e) => {
    e.preventDefault();
   
    sendForm(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_TEMPLATE_ID, formRef.current, process.env.REACT_APP_USER_ID)
      .then((result) => {
            toast.success('Email sent!')
            formRef.current.reset()
          console.log(result.text);
      }, (error) => {  
            toast.error("please try again.")
          console.log(error.text);
      });
  };
  return (
    <div className="contact2" style={{backgroundImage:"url(https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/map.jpg)"}} id="contact">
 <Toaster/>
  <div className="container">
    <div className="row contact-container">
      <div className="col-lg-12">
        <div className="card card-shadow border-0 mb-4">
          <div className="row">
            <div className="col-lg-8">
              <div className="contact-box p-4">
                <h4 className="title">Contact Us</h4>
                <form ref={formRef} onSubmit={sendEmail}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group mt-3">
                        <input className="form-control" name="from_name" type="text" placeholder="name"/>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mt-3">
                        <input className="form-control" name="email" type="text" placeholder="email"/>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mt-3">
                        <input className="form-control" name="phone" type="text" placeholder="phone"/>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mt-3">
                        <input className="form-control" name="location" type="text" placeholder="location" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group mt-3">
                        <input className="form-control"  name="message" type="text" placeholder="message" />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <button type="submit" className="btn btn-danger-gradiant mt-3 mb-3 text-white border-0 py-2 px-3"><span> SUBMIT NOW <i className="ti-arrow-right"></i></span></button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-4 bg-image" style={{backgroundImage:"url(https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/1.jpg)"}}>
              <div className="detail-box p-4">
                <h5 className="text-white font-weight-light mb-3">ADDRESS</h5>
                <p className="text-white op-7">Berlin, Germany</p>       
                <h5 className="text-white font-weight-light mb-3 mt-4">CALL US</h5>
                <p className="text-white op-7">0123123123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default Contact;