//此为主页
import React, { useState } from 'react';
import {
    Table,
    Pagination,
    Modal,
    Tooltip,
    Popover,
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    Checkbox,
    Popconfirm,
    message
} from 'antd';
import b1 from './img/b1.png';
//redux
//步骤一
import store from '../../store/store'
//引入请求接口
import httpAxios from '../../helpers/request';
import './index.css';
import logoimg from './img/banner.png';
import leftimg from './img/leftimg.png';
import t1 from './img/t1.png';
import t2 from './img/t2.png';
import t3 from './img/t3.png';
import t4 from './img/t4.png';
import t5 from './img/t5.png';
import k1 from './img/k1.png';
import tou from './img/tou.png';
import moment from 'moment';
//引入数据字典
import { NAME } from '../../constants/name';

class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [];
        this.state = {
            role: 1,
            data: "",
            rows: [],
            total: '',
            current: 1,
            type: '',
            source: '',
            state: '',
            balance: '',
            withdraw: '',
            deposit: '',
            trade_date: '',
            showDate: false,
            uid: '',
            source: '',
            username: '',
            selectedRowKeys: [],
            deleteUid: '',
            deleteSource: '',
            deleteArr: [],
            showAdd: false,
            uuid: "",
            uuname: "",
            uusource: "",

            broker_name: "",
            stock: "",
            futures: "",
            futures_index: "",
            expires_time: "",
            memo: "",
            broker_id_array: [],
            barray: [],
            showAdd1: false,
            user_name: "",
            stock_account: "",
            futures_account: "",
            futures_index_account: "",
            barray1: ""
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {
        this.getData(1, 16);
    }
    getData(page, size) {
        let role = localStorage.getItem('role');
        let url;
        this.setState({
            role: role
        }, () => {
            console.log('role', this.state.role);
            if (this.state.role == 1) {
                url = '/api.v1/broker/list';
            } else {
                url = '/api.v1/broker/user/list';
            }
            console.log('我是地址', url);
            let method = 'post';
            let beel = false;
            let options = {
                page: page,
                size: size
            };
            httpAxios(url, method, beel, options).then(res => {
                if (res.code === 0) {
                    res.data.rows.map((item, index) => {
                        if (index == 0) {
                            for (let key in item) {
                                if (item.hasOwnProperty(key)) {
                                    NAME.map((item1, index1) => {
                                        if (key == item1.key) {
                                            this.columns.push({
                                                title: item1.name,
                                                dataIndex: item1.key,
                                                key: item1.key,
                                                align: 'center',
                                                ellipsis: true,
                                                width: 120
                                            })
                                        }
                                    })
                                }
                            }
                        }
                        this.columns = this.deteleObject(this.columns);
                    })
                    this.setState({
                        rows: res.data.rows,
                        total: res.data.total
                    })
                }
            })
        });
    }
    //分页改变
    onChange = page => {
        console.log(page);
        this.setState({
            current: page,
        }, () => {
            this.getData(this.state.current, 16);
        });
    }
    changeShow(text, record) {
        console.log('record', record);
        let uid = record.id;
        let source = record.source;
        let url = '/api.v1/admin/account/up-state';
        let method = 'post';
        let beel = false;
        let options = {
            uid: uid,
            source: source
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                this.getData(1, 16);
            }
        })
    }
    changeNew(text, record) {
        this.setState({
            showDate: true
        })
        let uid = record.id;
        let source = record.source;
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth();//得到月份
        var date = now.getDate();//得到日期
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        let lastTime = year + month + date;
        this.setState({
            trade_date: lastTime,
            uid: uid,
            source: source
        })
        let url = '/api.v1/admin/account/trade-info';
        let method = 'post';
        let beel = false;
        let options = {
            uid: uid,
            source: source,
            trade_date: lastTime
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0 && res.data != null) {
                //balance权益，withdraw入金，deposit出金
                let data = res.data;
                this.setState({
                    balance: data.balance,
                    withdraw: data.withdraw,
                    deposit: data.deposit,
                    trade_date: moment(data.trade_date)
                })
            } else if (res.code === 0 && res.data == null) {
                this.setState({
                    balance: '',
                    withdraw: '',
                    deposit: '',
                    trade_date: moment(lastTime)
                })
            }
        })
    }
    getTimeChange() {
        let url = '/api.v1/admin/account/trade-info';
        let method = 'post';
        let beel = false;
        let options = {
            uid: this.state.uid,
            source: this.state.source,
            trade_date: moment(this.state.trade_date).format('YYYYMMDD')
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0 && res.data != null) {
                //balance权益，withdraw入金，deposit出金
                let data = res.data;
                this.setState({
                    balance: data.balance,
                    withdraw: data.withdraw,
                    deposit: data.deposit,
                    trade_date: moment(data.trade_date)
                })
            } else if (res.code === 0 && res.data == null) {
                this.setState({
                    balance: '',
                    withdraw: '',
                    deposit: '',
                    trade_date: moment(this.state.trade_date)
                })
            }
        })
    }
    gengxin() {
        let url = '/api.v1/admin/account/transform/trade-info';
        let method = 'post';
        let beel = false;
        let options = {
            uid: this.state.uid,
            source: this.state.source,
            trade_date: moment(this.state.trade_date).format('YYYYMMDD'),
            balance: this.state.balance,
            deposit: this.state.deposit,
            withdraw: this.state.withdraw
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                this.setState({
                    showDate: false
                })
                this.getData(1, 16);
            }
        })
    }
    qvxiao() {
        this.setState({
            showDate: false
        })
    }
    addU() {
        if (
            this.state.role == 1
        ) {
            this.setState({
                showAdd: true
            })
        } else {
            this.setState({
                showAdd1: true
            })
        }

    }
    addxin() {
        let url = '/api.v1/broker/add';
        let method = 'post';
        let beel = false;
        let options = {
            broker_name: this.state.broker_name,
            stock: this.state.stock,
            futures: this.state.futures,
            futures_index: this.state.futures_index,
            expires_time: this.state.expires_time,
            memo: this.state.memo
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                this.setState({
                    showAdd: false
                })
                this.getData(1, 16);
            }
        })
    }
    addxiao() {
        this.setState({
            showAdd: false
        })
    }

    addxin1() {
        let url = '/api.v1/broker/user/add';
        let method = 'post';
        let beel = false;
        let options = {
            user_name: this.state.user_name,
            stock: this.state.stock,
            futures: this.state.futures,
            futures_index: this.state.futures_index,
            stock_account: this.state.stock_account,
            futures_account: this.state.futures_account,
            futures_index_account: this.state.futures_index_account,
            memo: this.state.memo
        };
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                this.setState({
                    showAdd1: false
                })
                this.getData(1, 16);
            }
        })
    }
    addxiao1() {
        this.setState({
            showAdd1: false
        })
    }
    outout() {
        let url = '/logout';
        let method = 'post';
        let beel = false;
        let options = null;
        httpAxios(url, method, beel, options).then(res => {
            if (res.code === 0) {
                localStorage.clear();
                this.props.history.push('/login');
            }
        })
    }
    //数组去重
    deteleObject(obj) {
        let uniques = [];
        let stringify = {};
        for (let i = 0; i < obj.length; i++) {
            let keys = Object.keys(obj[i]);
            keys.sort(function (a, b) {
                return (Number(a) - Number(b));
            });
            let str = '';
            for (let j = 0; j < keys.length; j++) {
                str += JSON.stringify(keys[j]);
                str += JSON.stringify(obj[i][keys[j]]);
            }
            if (!stringify.hasOwnProperty(str)) {
                uniques.push(obj[i]);
                stringify[str] = true;
            }
        }
        uniques = uniques;
        return uniques;
    }
    onChangeValue(e, what) {
        console.log(e.target.checked, what);
        let whatChecked = e.target.checked;

        if (what == '证券' && whatChecked == true) {
            this.setState({
                stock: 1
            })
        }

        if (what == '证券' && whatChecked == false) {
            this.setState({
                stock: 0
            })
        }

        if (what == '期货' && whatChecked == true) {
            this.setState({
                futures: 1
            })
        }

        if (what == '期货' && whatChecked == false) {
            this.setState({
                futures: 0
            })
        }

        if (what == '期权' && whatChecked == true) {
            this.setState({
                futures_index: 1
            })
        }
        if (what == '期权' && whatChecked == false) {
            this.setState({
                futures_index: 0
            })
        }
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('是我啊', selectedRowKeys, selectedRows);
        this.setState({ selectedRowKeys, selectedRows });
        this.setState({
            broker_id_array: selectedRowKeys
        }, () => {
            console.log('我是数组', this.state.broker_id_array, typeof (this.state.broker_id_array))
            let barray = [];
            let barray1 = [];
            this.state.broker_id_array.map(item => {
                console.log('它', item);
                barray.push({ broker_id: item });
                barray1.push({ user_id: item });
            })
            this.setState({
                barray: barray,
                barray1: barray1
            })
        })
    }

    deleteU() {
        if (this.state.role == 1) {
            let url = '/api.v1/broker/del';
            let method = 'post';
            let beel = false;
            let options = this.state.barray;
            httpAxios(url, method, beel, options).then(res => {
                if (res.code === 0) {
                    // this.setState({
                    //     showAdd: false
                    // })
                    this.getData(1, 16);
                }
            })
        } else {
            let url = '/api.v1/broker/user/del';
            let method = 'post';
            let beel = false;
            let options = this.state.barray1;
            httpAxios(url, method, beel, options).then(res => {
                if (res.code === 0) {
                    // this.setState({
                    //     showAdd: false
                    // })
                    this.getData(1, 16);
                }
            })
        }

    }

    confirm(e) {
        this.deleteU();
    }

    cancel(e) {

    }

    render() {
        const { rows, total, showDate, trade_date, balance, withdraw, deposit, selectedRowKeys, showAdd, uuid, uuname, uusource, showAdd1, role } = this.state;
        const columns = this.columns;
        const dateFormat = 'YYYYMMDD';
        let username = localStorage.getItem('user_account_name').replace(/\"/g, "");
        const rowSelection = {
            selectedRowKeys,
            columnWidth: '20px',
            onChange: this.onSelectChange
        };
        return (
            /**
             * dataSource为数据数组
             * columns为表格的描述配置，列明什么之类的
             */
            <div className="leftleftbox">
                <div className="leftb">
                    <div className="toubox">
                        <img src={tou} />
                        <div className="loginout">
                            <div>{username}</div>
                            <div className="out" onClick={() => this.outout()}>[退出]</div>
                        </div>
                    </div>
                    {role == 1 ? <div className="userL">机构列表</div> : <div className="userL">会员列表</div>}
                </div>
                <div className="leftr">
                    <div className="caozuo">
                        <div onClick={() => this.addU()}>新增</div>
                        <Popconfirm
                            placement="topLeft"
                            title="确认删除？"
                            onConfirm={() => this.confirm()}
                            onCancel={() => this.cancel()}
                            okText="是"
                            cancelText="否"
                        >
                            <div>删除</div>
                        </Popconfirm>
                    </div>
                    {showDate == true ? <div className="topFix">
                        <div className="topForm">
                            <div className="topFTitle">更新数据<span className="closeX" onClick={() => this.qvxiao()}>X</span></div>
                            <Form
                                labelCol={{
                                    span: 4,
                                }}
                                wrapperCol={{
                                    span: 14,
                                }}
                                layout="horizontal"
                            >
                                <div className="padleft">
                                    <Form.Item label="日期选择 ">
                                        <DatePicker defaultValue={moment()} format={dateFormat} onChange={(trade_date) => this.setState({ trade_date }, () => {
                                            this.getTimeChange();
                                        })} />
                                    </Form.Item>
                                    <Form.Item label="当日权益 ">
                                        <Input value={this.state.balance} onChange={e => this.setState({ balance: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="当日出金 ">
                                        <Input value={this.state.withdraw} onChange={e => this.setState({ withdraw: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="当日入金 ">
                                        <Input value={this.state.deposit} onChange={e => this.setState({ deposit: e.target.value })} />
                                    </Form.Item>
                                </div>
                                <Form.Item className="toRight">
                                    <Button className='gen' onClick={() => this.gengxin()}>更新</Button>
                                    <Button className='qv' onClick={() => this.qvxiao()}>取消</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div> : ''}
                    {showAdd == true ? <div className="topFix">
                        <div className="topForm">
                            <div className="topFTitle">新增<span className="closeX" onClick={() => this.addxiao()}>X</span></div>
                            <Form
                                labelCol={{
                                    span: 6,
                                }}
                                wrapperCol={{
                                    span: 14,
                                }}
                                layout="horizontal"
                            >
                                <div className="padleft">
                                    <div style={{ height: '30px' }}></div>
                                    <Form.Item label="机构名称">
                                        <Input value={this.state.broker_name} onChange={e => this.setState({ broker_name: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="交易权限">
                                        <Checkbox onChange={(e) => this.onChangeValue(e, '证券')}>证券</Checkbox>
                                        <Checkbox onChange={(e) => this.onChangeValue(e, '期货')}>期货</Checkbox>
                                        <Checkbox onChange={(e) => this.onChangeValue(e, '期权')}>期权</Checkbox>
                                    </Form.Item>
                                    <Form.Item label="日期选择">
                                        <DatePicker defaultValue={moment()} format={dateFormat} onChange={(expires_time) => this.setState({ expires_time }, () => {
                                            console.log('我是时间啊', this.state.expires_time)
                                        })} />
                                    </Form.Item>
                                    <Form.Item label="备注">
                                        <Input value={this.state.memo} onChange={e => this.setState({ memo: e.target.value })} />
                                    </Form.Item>
                                </div>
                                <Form.Item className="toRight">
                                    <Button className='gen' onClick={() => this.addxin()}>确认</Button>
                                    <Button className='qv' onClick={() => this.addxiao()}>取消</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div> : ''}

                    {showAdd1 == true ? <div className="topFix">
                        <div className="topForm topForm1">
                            <div className="topFTitle">新增<span className="closeX" onClick={() => this.addxiao1()}>X</span></div>
                            <Form
                                labelCol={{
                                    span: 6,
                                }}
                                wrapperCol={{
                                    span: 14,
                                }}
                                layout="horizontal"
                            >
                                <div className="padleft">
                                    <div style={{ height: '30px' }}></div>
                                    <Form.Item label="用户名称 ">
                                        <Input value={this.state.user_name} onChange={e => this.setState({ user_name: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="交易权限 ">
                                        <Checkbox onChange={(e) => this.onChangeValue(e, '证券')}>证券</Checkbox>
                                        <Checkbox onChange={(e) => this.onChangeValue(e, '期货')}>期货</Checkbox>
                                        <Checkbox onChange={(e) => this.onChangeValue(e, '期权')}>期权</Checkbox>
                                    </Form.Item>
                                    <Form.Item label="证券账号 ">
                                        <Input value={this.state.stock_account} onChange={e => this.setState({ stock_account: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="期货账号 ">
                                        <Input value={this.state.futures_account} onChange={e => this.setState({ futures_account: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="期权账号 ">
                                        <Input value={this.state.futures_index_account} onChange={e => this.setState({ futures_index_account: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item label="备注 ">
                                        <Input value={this.state.memo} onChange={e => this.setState({ memo: e.target.value })} />
                                    </Form.Item>
                                </div>
                                <Form.Item className="toRight">
                                    <Button className='gen' onClick={() => this.addxin1()}>确认</Button>
                                    <Button className='qv' onClick={() => this.addxiao1()}>取消</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div> : ''}
                    <div className="tableBox1">
                        {role == 1 ? <Table rowKey={record => record.broker_id} loading={false} bordered rowClassName={(record, index) => {
                            let className = 'light-row';
                            if (index % 2 === 1) className = 'dark-row';
                            return className;
                        }} rowSelection={rowSelection} dataSource={rows} columns={columns} size="small" scroll={{ y: 670 }} pagination={false} /> : <Table rowKey={record => record.user_account_id} loading={false} bordered rowClassName={(record, index) => {
                            let className = 'light-row';
                            if (index % 2 === 1) className = 'dark-row';
                            return className;
                        }} rowSelection={rowSelection} dataSource={rows} columns={columns} size="small" scroll={{ y: 670 }} pagination={false} />}

                        <div className="pagen">
                            <Pagination size="small" current={this.state.current} defaultPageSize={16} onChange={this.onChange} total={total} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserCenter;