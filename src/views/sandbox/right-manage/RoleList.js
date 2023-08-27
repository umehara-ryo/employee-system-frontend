import React, {useEffect, useState} from 'react'
import {Button, Modal, Popover, Switch, Table} from "antd";
import axios from "axios";
import {DeleteOutlined, MenuFoldOutlined ,ExclamationCircleOutlined} from "@ant-design/icons";
import Tree from "antd/es/tree/Tree";

export default function RoleList() {

   const [dataSource,setDataSource] = useState([]);
   const [isModalOpen,setIsModalOpen] = useState(false);
   const [treeData,setTreeData] = useState([]);
   const [currentRights,setCurrentRights] = useState([]);
   const [currentId,setCurrentId] = useState(0);




    const handleCancel = () => {
        setIsModalOpen(false);
    };


   const columns = [
       {
           title: 'ID',
           dataIndex: 'id',
           render: (id) => {
               return <b>{id}</b>
           }
       },
       {
           title: 'ロール名',
           dataIndex: 'roleName',
           render: (roleName)=>{
               return<i>{roleName}</i>
           }
   },
       {
           title: '操作',
           render: (item)=>{
               return　<div>


                       <Button type="primary" shape="circle" icon={<MenuFoldOutlined />}  onClick={()=>showModal(item)}
                       ></Button>

                   <Button danger shape="circle" icon={<DeleteOutlined/>}  onClick={()=>confirmDelete(item)}></Button>
               </div>
           }
       },

   ];

    useEffect(()=>{
        axios.get('http://localhost:5000/roles').then(res=>{
            console.log(res.data);
            setDataSource(res.data);
        })

    },[]);

    useEffect(()=>{
        axios.get('http://localhost:5000/rights?_embed=children').then(res=>{
            console.log(res.data);
            setTreeData(res.data);
        })

    },[]);


    const {confirm} = Modal;
    const confirmDelete = (item)=>{
        confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
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

    const deleteMethod = (item)=>{

            console.log(item);
            setDataSource(dataSource.filter(data => data.id !== item.id));
            axios.delete(`http://localhost:5000/roles/${item.id}`);

    }

    const onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };
    const onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        setCurrentRights(checkedKeys.checked);
    }
    const showModal = (item) => {
        setIsModalOpen(true);
        console.log(item)
        setCurrentRights(item.rights);
        setCurrentId(item.id);
    };

    const handleOk = () => {
        setDataSource(dataSource.map(item=>{
            if(item.id === currentId){
                return{
                    ...item,
                    rights:currentRights
                }
            }
            return item;
        }))

        axios.patch(`http://localhost:5000/roles/${currentId}`,{
            rights:currentRights
        })

        setIsModalOpen(false);
    };

    return (
        <div>
               <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}></Table>
            <Modal title="権限割当"  open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkStrictly = {true}
                    checkedKeys={currentRights}
                    onSelect={onSelect}
                    onCheck={onCheck}
                    treeData={treeData}
                />
            </Modal>
        </div>
    )
}
