import React from 'react'
import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from 'react-router';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    let CREATE_USER = "https://demo2.z-bit.ee/users"
    const onFinish = async (values) => {
     
      await axios.post(CREATE_USER,{username:values.username,newPassword:values.password}).then(res=>{
         console.log(res.data);
         if(res.status == 201){
          notification.success({
            message:"Registration successful!"
          })
         }
       }).catch(err=>{
         notification.error({
          message:err.response.data[0].message
         })
       })
    };

    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Col span={4}>
                <h1>Register</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "", confirm_password:"" }}
                    onFinish={onFinish}>

                      <Form.Item
                          label="Username"
                          name="username"
                          rules={[{ required: true, message: 'Please input your username!' }]}>
                          <Input />
                      </Form.Item>

                      <Form.Item
                          label="Password"
                          name="password"
                          rules={[{ required: true, message: 'Please input your password!' }]}
                          hasFeedback>
                          <Input.Password />
                      </Form.Item>

                      <Form.Item
                        name="confirm_password"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: 'Please confirm your password!',
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                          }),
                        ]}>

                        <Input.Password />
                      </Form.Item>

                      <Form.Item>
                          <Button type="primary" htmlType="submit">Register</Button>
                      </Form.Item>
                 </Form>
            </Col>
        </Row>
    )
  }

export default Register