import React, { useState, useEffect } from 'react'
import '../../Styles/Profile.scss'
import Footer from '../Layout/Footer'

const Profile = () => {
  const saved = typeof window !== 'undefined' && localStorage.getItem('userProfile')
  const initial = saved ? JSON.parse(saved) : {
    firstName: 'Amelia',
    lastName: 'Robert',
    email: 'amelia.watson@eshop.com',
    password: '',
    avatar: '/Images/profile.jpg',
  }

  const [profile, setProfile] = useState(initial)
  const [preview, setPreview] = useState(profile.avatar)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setPreview(profile.avatar)
  }, [profile.avatar])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      setProfile(prev => ({ ...prev, avatar: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem('userProfile', JSON.stringify(profile))
    setEditing(false)
    alert('Profile saved locally')
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="avatar-wrap">
            <img src={preview} alt="Profile" className="avatar" />
            <label className="change-btn">
              Change
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>
          </div>
          <h3 className="name">{profile.firstName} {profile.lastName}</h3>
          <p className="email">{profile.email}</p>

          <ul className="sidebar-links">
            <li>Orders</li>
            <li>Wallet</li>
            <li>Cart</li>
            <li>Address</li>
            <li className="active">Account Details</li>
            <li>Log Out</li>
          </ul>
        </aside>

        <main className="profile-main">
          <div className="cards-row">
            <div className="card">Order Tracking<br/><small>See your order history.</small></div>
            <div className="card">Billing Address<br/><small>Set your billing address.</small></div>
          </div>

          <section className="account-details">
            <h2>Account Details</h2>
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="firstName" value={profile.firstName} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lastName" value={profile.lastName} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input name="email" value={profile.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" value={profile.password} onChange={handleChange} placeholder="Enter new password" />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">Save Profile</button>
                <button type="button" className="btn-cancel" onClick={() => {
                  setProfile(initial)
                  setPreview(initial.avatar)
                }}>Reset</button>
              </div>
            </form>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Profile
