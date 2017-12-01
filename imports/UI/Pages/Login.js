import React, { Component } from 'react';
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert,message} from 'antd';
import styles from './Login.css';
const FormItem = Form.Item;
const { TabPane } = Tabs;

class Login extends Component {
    state = {
        count: 0,
        type: 'account',
        error: null
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
    }

    onSwitch = (key) => {
        this.setState({
            type: key,
        });
    }

    onGetCaptcha = () => {
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
            count -= 1;
            this.setState({ count });
            if (count === 0) {
                clearInterval(this.interval);
            }
        }, 1000);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { type } = this.state;
        this.props.form.validateFields({ force: true },
            (err, values) => {
                if (!err) {
                    var _this=this;
                    Meteor.loginWithPassword(values.userName,values.password,function(err){
                        if(!err)
                        {
                            //登录成功
                            message.success('登录成功')
                            FlowRouter.go('/')
                        }
                        else {
                            _this.setState({error:`${err.reason}`})
                        }
                    })
                }
            }
        );
    }

    renderMessage = (message) => {
        return (
            <Alert
                style={{ marginBottom: 24 }}
                message={message}
                type="error"
                showIcon
            />
        );
    }

    render() {
        const { form, login } = this.props;
        const { getFieldDecorator } = form;
        const { count, type } = this.state;
        return (

            <div className={"main"}>
                <Form onSubmit={this.handleSubmit}>
                    <Tabs animated={false} className={"tabs"} activeKey={type} onChange={this.onSwitch}>
                        <TabPane tab="账户密码登录" key="account">
                            {
                                this.state.error!==null &&
                                this.renderMessage(this.state.error)
                            }
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [{
                                        required: type === 'account', message: '请输入账户名！',
                                    }],
                                })(
                                    <Input
                                        size="large"
                                        prefix={<Icon type="user" className={"prefixIcon"} />}
                                        placeholder="admin"
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: type === 'account', message: '请输入密码！',
                                    }],
                                })(
                                    <Input
                                        size="large"
                                        prefix={<Icon type="lock" className={"prefixIcon"} />}
                                        type="password"
                                        placeholder="888888"
                                    />
                                )}
                            </FormItem>
                        </TabPane>
                        <TabPane tab="手机号登录" key="mobile">
                            {
                                false &&
                                this.renderMessage('验证码错误')
                            }
                            <FormItem>
                                {getFieldDecorator('mobile', {
                                    rules: [{
                                        required: type === 'mobile', message: '请输入手机号！',
                                    }, {
                                        pattern: /^1\d{10}$/, message: '手机号格式错误！',
                                    }],
                                })(
                                    <Input
                                        size="large"
                                        prefix={<Icon type="mobile" className={"prefixIcon"} />}
                                        placeholder="手机号"
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {getFieldDecorator('captcha', {
                                            rules: [{
                                                required: type === 'mobile', message: '请输入验证码！',
                                            }],
                                        })(
                                            <Input
                                                size="large"
                                                prefix={<Icon type="mail" className={"prefixIcon"} />}
                                                placeholder="验证码"
                                            />
                                        )}
                                    </Col>
                                    <Col span={8}>
                                        <Button
                                            disabled={count}
                                            className={styles.getCaptcha}
                                            size="large"
                                            onClick={this.onGetCaptcha}
                                        >
                                            {count ? `${count} s` : '获取验证码'}
                                        </Button>
                                    </Col>
                                </Row>
                            </FormItem>
                        </TabPane>
                    </Tabs>
                    <FormItem className={"additional"}>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox className={"autoLogin"}>自动登录</Checkbox>
                        )}
                        <a className={"forgot"} onClick={()=>{FlowRouter.go('/forgotPassword')}}>忘记密码</a>
                        <Button size="large" loading={false} className={"submit"} type="primary" htmlType="submit">
                            登录
                        </Button>
                    </FormItem>
                </Form>
                <div className={"other"}>
                    其他登录方式
                    {/* 需要加到 Icon 中 */}
                    <span className={"iconAlipay"} />
                    <span className={"iconTaobao"} />
                    <span className={"iconWeibo"} />
                    <a className={"register"} onClick={()=>{FlowRouter.go('/register')}}>注册账户</a>
                </div>
            </div>
        );
    }
}
export default Form.create()(Login)