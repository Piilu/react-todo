import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider, notification } from "antd";
import axios from "axios";
import produce from "immer";
import { useEffect } from "react";
import { useState } from "react";
import { debounce } from "lodash"


export default function TaskList({userAuth,checkAuth}) {
    const TASK_URL = "https://demo2.z-bit.ee/tasks";
    const config = {
        headers: { Authorization: `Bearer ${userAuth.access_token}` }
    };
    const [tasks, setTasks] = useState([
      
    ]);

    const getTasks = async () => {
        await axios.get(TASK_URL,config).then(res => {
            const loadedTasks = [];
            res.data.forEach(task => {
                loadedTasks.push({
                    id:task.id,
                    name:task.title,
                    completed:task.marked_as_done
                })
            });
            setTasks(loadedTasks)
        }).catch(err => {
            notification.error({
                message: "Cant get tasks"
            })
        });
    }
    const handleLogOut = () =>{
        localStorage.clear();
        checkAuth();

    }
    const handleNameChange = async (task, event) => {
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].name = event.target.value;
        });
        setTasks(newTasks);
        saveDebounce(task,event);
        
    };

    const saveDebounce =  debounce(async (task,event) => {
            console.log("DEBOUNCE")
            await axios.put(`${TASK_URL}/${task.id}`,{title:event.target.value,marked_as_done:task.completed},config).catch(err=>{
                console.log(err)
                notification.error({
                    message:err.response.data[0].message
                })
          });
    },300)
    
    const handleCompletedChange = async(task, event) => {
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].completed = event.target.checked;
        });
        setTasks(newTasks);
        
        await axios.put(`${TASK_URL}/${task.id}`,{title:task.title,marked_as_done:event.target.checked},config).catch(err=>{
            console.log(err)
            notification.error({
                message:err.response.data[0].message
            })
        })
      
    };

    const handleAddTask = async () => {
        await axios.post(TASK_URL,{title:`New Task ${Math.floor(Math.random() * 10000)     }`,desc:""},config).then(res=>{
            setTasks(produce(tasks, draft => {
                draft.push({
                    id: res.data.id,
                    name: res.data.title,
                    completed: res.data.marked_as_done
                });
            }));
        }).catch(err=>{
            notification.error({
                message:err.response.data[0].message
            })
        })

        
    };

    const handleDeleteTask = async(task) => {
        await axios.delete(`${TASK_URL}/${task.id}`,config).then(res=>{
            notification.success({
                message:`${task.name} deleted successfully`,
            })
            setTasks(produce(tasks, draft => {
                const index = draft.findIndex(t => t.id === task.id);
                draft.splice(index, 1);
            }));
        }).catch(err=>{
            notification.error({
                message:err.response.data[0]
            })
        })
    };

    useEffect(() => {
        getTasks()
    },[])
    return (
        <Row type="flex" justify="center" style={{ minHeight: '100vh', marginTop: '6rem' }}>
            <Col span={12}>
                <h1>Task List</h1>
                <Button onClick={handleAddTask}>Add Task</Button>
                <Button onClick={handleLogOut}>Logout</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{ width: '100%' }}>
                            <Space>
                                <Checkbox checked={task.completed} onChange={(e) => handleCompletedChange(task, e)} />
                                <Input value={task.name} onChange={(event) => handleNameChange(task, event)} />
                            </Space>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}