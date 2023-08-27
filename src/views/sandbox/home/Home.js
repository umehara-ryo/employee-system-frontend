import React, {useEffect, useRef, useState} from 'react'
import {Button, Input, message, Modal, Popover, Row, Switch, Table, Tag} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from "axios";
import './Home.css'
import BackGround from '../../../resources/img/background1.jpg'
import UserForm from "../../../components/user-manage/UserForm";
import moment from "moment";
import dayjs from "dayjs";


export default function Home(props) {
    const [dataSource, setDataSource] = useState([])
    const [open, setOpen] = useState(false)
    const [updateOpen, setUpdateOpen] = useState(false)
    const [currentUpdate, setCurrentUpdate] = useState(false)

    const addForm = useRef(null);
    const updateForm = useRef(null);
    const findInput = useRef(null);
    

    useEffect(() => {
        axios.get('/employee/search').then(res => {
            console.log(res);
            setDataSource(res.data.data)
        })
    }, [])

    const columns = [
        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>社員番号</div>,
            dataIndex: 'empCd',
            align: "center",
            render: (empCd) => {
                return <div style={{
                    color: "#337ab7"
                }}>{empCd}</div>
            }
        },
        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>名前</div>,
            align: "center",
            dataIndex: 'name',
            render: (name) => {
                return <i style={{
                    color: "#337ab7"
                }}>{name}</i>
            }
        },
        {

            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>生年月日</div>,
            dataIndex: 'birthday',
            align: "center",
            render: (birthday) => {
                return <div style={{
                    color: '#337ab7'
                }}>{birthday}</div>
            }
        },

        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>国籍</div>,
            align: "center",
            dataIndex: 'nationalityName',
            render: (nationalityName) => {
                return <div style={{
                    color: '#337ab7'
                }}>{nationalityName}</div>
            }
        },
        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>性別</div>,
            align: "center",
            dataIndex: 'genderName',
            render: (genderName) => {
                return <Tag color={genderName === '女性' ? 'lightpink' : '#337ab7'}>{genderName}</Tag>
            }
        },
        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>操作</div>,
            align: "center",
            render: (item) => {
                return <div>

                    <Button type="primary" style={{backgroundColor: '#337ab7'}}
                    onClick={()=>update(item)}>変更</Button>

                    <Button danger onClick={() => confirmDelete(item)}>削除</Button>
                </div>
            }
        },
    ];

    const {confirm} = Modal;
    const confirmDelete = (item) => {
        confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined/>,
            content: '削除しますか',
            okText: '削除',
            cancelText: 'キャンセル',
            onOk() {
                console.log('OK');
                deleteMethod(item);
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }
    const deleteMethod = (item) => {

        //dataSource更新
        setDataSource(dataSource.filter((data)=>data.empCd!==item.empCd))
        //database更新
        axios.delete(`/employee/delete/${item.empCd}`).then(res=>{
            message.success("削除成功")
        })

        }



    const logout = () => {
        localStorage.removeItem('token');
        props.history.push(`/login`);
        message.success("ログアウトしました");
    }
    const find = () => {

       let value = findInput.current.input.value
        console.log(value);
       axios.get(`/employee/find/${value}`).then(res=>{
           setDataSource(res.data.data);
       })


    }


    const addFormOk = () => {
        addForm.current.validateFields().then(value => {
            const birthday =value.birthday.format('YYYY-MM-DD')
            console.log(birthday);
            axios.post(`/employee/add`, {
                ...value,
                birthday
            }).then(res => {
                if (res.data.code === 1) {
                    setOpen(false);
                    message.success("登録成功")
                } else {
                    message.error(res.data.message ? res.data.message : '登録失敗')
                }

            })
        })

    }

    const update = (item) => {
        setTimeout(()=>{

            setCurrentUpdate(item.empCd);
            console.log(item.birthday);
           let birthday = dayjs(item.birthday);
            setUpdateOpen(true);
            updateForm.current.setFieldsValue({
                ...item,
                birthday
            });
        })



    }
    const updateFormOk = () => {
        updateForm.current.validateFields().then(value => {
            const birthday =value.birthday.format('YYYY-MM-DD')
            console.log(birthday);
            value.birthday = birthday;
            //dataSource更新
            setDataSource(dataSource.map(item=>{
                if(item.empCd === currentUpdate){
                    return {
                        ...item,
                        ...value,
                    }
                }
                return item;
            }))
            
            
            //データベース更新
            axios.put(`/employee/update`, {
                ...value,
                empCd:currentUpdate
            }).then(res => {
                if (res.data.code === 1) {
                    setUpdateOpen(false);
                    message.success("変更成功")
                } else {
                    message.error(res.data.message ? res.data.message : '変更失敗')
                }

            })
        })


    }


    return (


        <div>
            <div style={{
                color: "#337ab7",
                fontSize: '30px',
                textAlign: "center"
            }}>社員情報一覧<br/></div>

            <div>
                <Button style={{
                    left: '80%',
                    backgroundColor: 'rgba(92,184,92)',
                    color: 'white'
                }} onClick={() => setOpen(true)}>社員登録</Button>
                <Button style={{
                    left: '82%',
                    backgroundColor: 'rgba(240, 173, 78)',
                    color: 'white'
                }} onClick={() => logout(true)}>ログアウト</Button>
            </div>
            <br/>
            <Input style={{
                width: "200px",
                left: "70%"
            }} ref={findInput}></Input>
            <Button style={{
                left: '72%',
                backgroundColor: 'rgba(238, 238，238)',
                color: 'rgba(51, 122, 183)'
            }} onClick={find}
            >社員検索</Button>

            <br/> <br/>


            <div>
                <Table style={{
                    backgroundImage: `url(${BackGround})`,
                    height: "100%",
                    backgroundSize: '100% 100%',
                }}

                       size='middle'

                       dataSource={dataSource}
                       columns={columns}
                       rowKey={item => item.empCd}
                       pagination={{
                           pageSize: 6
                       }}
                /></div>

            <Modal
                open={open}
                title="新規追加"
                okText="追加"
                cancelText="キャンセル"
                onCancel={() => setOpen(false)}
                onOk={addFormOk}
            >
                <UserForm ref={addForm}></UserForm>
            </Modal>

            <Modal
                open={updateOpen}
                title="情報変更"
                okText="変更"
                cancelText="キャンセル"
                onCancel={() => setUpdateOpen(false)}
                onOk={() => updateFormOk()}
            >
                <UserForm  ref={updateForm} isUpdate={1}></UserForm>
            </Modal>
        </div>
    )
}
