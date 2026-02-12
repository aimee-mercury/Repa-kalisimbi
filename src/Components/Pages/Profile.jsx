import React, { useContext, useState } from 'react'
import { AuthContext } from '../../AuthContext'
import '../../Styles/Profile.scss'
import Footer from '../Layout/Footer'

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext)
  const saved = typeof window !== 'undefined' && localStorage.getItem('settingsProfile')
  const parsed = saved ? JSON.parse(saved) : {}
  const [fallbackFirstName = 'User', fallbackLastName = ''] = String(user?.name || 'User').split(' ')
  const initial = {
    firstName: parsed.firstName || fallbackFirstName,
    lastName: parsed.lastName || fallbackLastName,
    email: user?.email || parsed.email || '',
    password: '',
    avatar:
      parsed.avatar && !String(parsed.avatar).includes('/Images/profile.jpg')
        ? parsed.avatar
        : '',
  }

  const [profile, setProfile] = useState(initial)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setProfile(prev => ({ ...prev, avatar: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem('settingsProfile', JSON.stringify(profile))
    updateUserProfile(profile)
    alert('Profile saved locally')
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="avatar-wrap">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="avatar" />
            ) : (
              <div className="avatar avatar-fallback">
                {(profile.firstName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
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
