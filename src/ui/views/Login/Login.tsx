/**
 * Copyright 2026 GitProxy Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Input from '@material-ui/core/Input';
import Button from '../../components/CustomButtons/Button';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import axios, { AxiosError } from 'axios';
import logo from '../../assets/img/git-proxy.png';
import { Badge, CircularProgress, FormLabel, Snackbar } from '@material-ui/core';
import { useAuth } from '../../auth/AuthProvider';
import { getBaseUrl } from '../../services/apiConfig';
import { getAxiosConfig, processAuthError } from '../../services/auth';
import { BackendResponse } from '../../types';
import { PublicUser } from '../../../db/types';

interface LoginResponse {
  message: string;
  user: PublicUser;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useAuth();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [gitAccountError, setGitAccountError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authMethods, setAuthMethods] = useState<string[]>([]);
  const [usernamePasswordMethod, setUsernamePasswordMethod] = useState<string>('');
  const [requirePasswordChange, setRequirePasswordChange] = useState<boolean>(false);
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  useEffect(() => {
    const fetchAuthConfig = async () => {
      const baseUrl = await getBaseUrl();
      const response = await axios.get(`${baseUrl}/api/auth/config`);
      const usernamePasswordMethod = response.data.usernamePasswordMethod;
      const otherMethods = response.data.otherMethods;

      setUsernamePasswordMethod(usernamePasswordMethod);
      setAuthMethods(otherMethods);

      // Automatically login if only one non-username/password method is enabled
      if (!usernamePasswordMethod && otherMethods.length === 1) {
        await handleAuthMethodLogin(otherMethods[0]);
      }
    };
    fetchAuthConfig();
  }, []);

  useEffect(() => {
    if (authContext.user?.mustChangePassword) {
      setRequirePasswordChange(true);
    }
  }, [authContext.user]);

  function validateForm(): boolean {
    return (
      username.length > 0 && username.length < 100 && password.length > 0 && password.length < 200
    );
  }

  function validatePasswordChangeForm(): boolean {
    return (
      currentPasswordForChange.length > 0 &&
      newPassword.length >= 8 &&
      confirmNewPassword.length >= 8 &&
      newPassword === confirmNewPassword &&
      newPassword !== currentPasswordForChange
    );
  }

  async function handleAuthMethodLogin(authMethod: string): Promise<void> {
    const baseUrl = await getBaseUrl();
    window.location.href = `${baseUrl}/api/auth/${authMethod}`;
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setIsLoading(true);

    try {
      const baseUrl = await getBaseUrl();
      const loginUrl = `${baseUrl}/api/auth/login`;
      const response = await axios.post<LoginResponse>(
        loginUrl,
        { username, password },
        getAxiosConfig(),
      );
      if (response.data?.user?.mustChangePassword) {
        setRequirePasswordChange(true);
        setCurrentPasswordForChange(password);
        setMessage('For security, you must change your password before continuing.');
        await authContext.refreshUser();
        return;
      }
      window.sessionStorage.setItem('git.proxy.login', 'success');
      setMessage('Success!');
      setSuccess(true);
      await authContext.refreshUser();
      navigate(0);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 307) {
          window.sessionStorage.setItem('git.proxy.login', 'success');
          setGitAccountError(true);
        } else if (error.response?.status === 403) {
          setMessage(processAuthError(error, false));
        } else {
          setMessage('You entered an invalid username or password...');
        }
      } else {
        setMessage('You entered an invalid username or password...');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordChangeSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setIsLoading(true);

    if (!validatePasswordChangeForm()) {
      setMessage(
        'Please provide your current password and a new password (minimum 8 characters) that matches confirmation.',
      );
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = await getBaseUrl();
      await axios.post(
        `${baseUrl}/api/auth/change-password`,
        {
          currentPassword: currentPasswordForChange,
          newPassword,
        },
        getAxiosConfig(),
      );
      await authContext.refreshUser();
      setRequirePasswordChange(false);
      setSuccess(true);
      setMessage('Password updated successfully.');
      navigate('/dashboard/repo', { replace: true });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const backendMessage =
          (error.response?.data as BackendResponse | undefined)?.message ??
          'Unable to update password';
        setMessage(backendMessage);
      } else {
        setMessage('Unable to update password');
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (gitAccountError) {
    return <Navigate to='/dashboard/profile' />;
  }

  if (success) {
    return <Navigate to='/dashboard/repo' />;
  }

  if (authContext.user && !authContext.user.mustChangePassword && !requirePasswordChange) {
    return <Navigate to='/dashboard/repo' />;
  }

  return (
    <form onSubmit={requirePasswordChange ? handlePasswordChangeSubmit : handleSubmit}>
      <Snackbar
        open={!!message}
        message={message}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={() => setMessage('')}
      />
      <GridContainer justifyContent='center' style={{ minHeight: '100vh' }} alignItems='center'>
        <GridItem xs={12} sm={10} md={6} lg={4} xl={3}>
          <Card>
            <CardHeader color='primary'>
              <div style={{ textAlign: 'center', margin: '12px 10px' }}>
                <img
                  src={logo}
                  alt='logo'
                  width={150}
                  style={{ verticalAlign: 'middle', filter: 'brightness(0) invert(1)' }}
                  data-test='git-proxy-logo'
                />
              </div>
            </CardHeader>
            {requirePasswordChange ? (
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormLabel component='legend' style={{ fontSize: '1.2rem', marginTop: 10 }}>
                      Password change required
                    </FormLabel>
                    <FormLabel
                      component='legend'
                      style={{ fontSize: '0.95rem', marginTop: 10, opacity: 0.8 }}
                    >
                      This account is using an insecure default password. Update it now to continue.
                    </FormLabel>
                    <FormControl fullWidth>
                      <InputLabel htmlFor='current-password'>Current password</InputLabel>
                      <Input
                        id='current-password'
                        type='password'
                        value={currentPasswordForChange}
                        onChange={(e) => setCurrentPasswordForChange(e.target.value)}
                        data-test='current-password'
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel htmlFor='new-password'>New password</InputLabel>
                      <Input
                        id='new-password'
                        type='password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        data-test='new-password'
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel htmlFor='confirm-new-password'>Confirm new password</InputLabel>
                      <Input
                        id='confirm-new-password'
                        type='password'
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        data-test='confirm-new-password'
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
              </CardBody>
            ) : usernamePasswordMethod ? (
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormLabel component='legend' style={{ fontSize: '1.2rem', marginTop: 10 }}>
                      Login
                    </FormLabel>
                    <FormControl fullWidth>
                      <InputLabel htmlFor='username'>Username</InputLabel>
                      <Input
                        id='username'
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                        data-test='username'
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor='password'>Password</InputLabel>
                      <Input
                        id='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        data-test='password'
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
              </CardBody>
            ) : (
              <CardBody>
                <FormLabel
                  component='legend'
                  style={{ fontSize: '1rem', marginTop: 10, marginBottom: 0 }}
                >
                  Username/password authentication is not enabled at this time.
                </FormLabel>
              </CardBody>
            )}
            {/* Show login buttons if available (one on top of the other) */}
            <CardFooter style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {!isLoading ? (
                <>
                  {requirePasswordChange ? (
                    <Button
                      color='success'
                      block
                      disabled={!validatePasswordChangeForm()}
                      type='submit'
                      data-test='password-change'
                    >
                      Update password
                    </Button>
                  ) : (
                    usernamePasswordMethod && (
                      <Button
                        color='success'
                        block
                        disabled={!validateForm()}
                        type='submit'
                        data-test='login'
                      >
                        Login
                      </Button>
                    )
                  )}
                  {!requirePasswordChange &&
                    authMethods.map((am) => (
                      <Button
                        color='success'
                        block
                        onClick={() => handleAuthMethodLogin(am)}
                        data-test={`${am}-login`}
                        key={am}
                      >
                        Login
                        {authMethods.length > 1 || usernamePasswordMethod
                          ? ` with ${am.toUpperCase()}`
                          : ''}
                      </Button>
                    ))}
                </>
              ) : (
                <div style={{ textAlign: 'center', width: '100%', opacity: 0.5, color: 'green' }}>
                  <CircularProgress color='inherit' />
                </div>
              )}
            </CardFooter>
          </Card>
          <div style={{ textAlign: 'center', opacity: 0.9, fontSize: 12, marginTop: 20 }}>
            <Badge
              overlap='rectangular'
              color='error'
              badgeContent='NEW'
              style={{ marginRight: 20 }}
            />
            <span style={{ paddingLeft: 20 }}>
              View our <a href='/dashboard/push'>open source activity feed</a> or{' '}
              <a href='/dashboard/repo'>scroll through projects</a> we contribute to
            </span>
          </div>
        </GridItem>
      </GridContainer>
    </form>
  );
};

export default Login;
