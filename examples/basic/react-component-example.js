// 예제 1: React 클래스 컴포넌트 → 함수형 컴포넌트 변환
// Codex 명령어: codex "Convert this class component to a functional component using React Hooks"

// BEFORE: 클래스형 컴포넌트
import React from 'react';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      error: null
    };
  }
  
  componentDidMount() {
    this.fetchUserData();
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUserData();
    }
  }
  
  fetchUserData = async () => {
    try {
      this.setState({ loading: true, error: null });
      const response = await fetch(`/api/users/${this.props.userId}`);
      const user = await response.json();
      this.setState({ user, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }
  
  handleUpdateUser = (userData) => {
    this.setState({ user: { ...this.state.user, ...userData } });
  }
  
  render() {
    const { user, loading, error } = this.state;
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>User not found</div>;
    
    return (
      <div className="user-profile">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button onClick={() => this.handleUpdateUser({ lastSeen: new Date() })}>
          Update Last Seen
        </button>
      </div>
    );
  }
}

export default UserProfile;

/* 
AFTER: 함수형 컴포넌트 (Codex가 변환한 결과)

import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, [userId]);
  
  const handleUpdateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => handleUpdateUser({ lastSeen: new Date() })}>
        Update Last Seen
      </button>
    </div>
  );
};

export default UserProfile;
*/