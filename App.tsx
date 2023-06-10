import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber } from 'antd';
import axios from 'axios';

const { Column } = Table;

type ImportedData = {
  id: number;
  itemNo: string;
  description: string;
  rate: number;
  qty: number;
  amount: number;
};

const App: React.FC = () => {
  const [importedData, setImportedData] = useState<ImportedData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(' http://localhost:3001/api/imported-data');
      setImportedData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event:any) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await axios.post('http://localhost:3001/api/imported-data', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (record: ImportedData) => {
    setEditId(record.id);
    fetchData();
    setVisible(true);
  };

  const handleDelete = async (record: ImportedData) => {
    try {
      await axios.delete(` http://localhost:3001/api/imported-data/${record.id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalOk = () => {
    setVisible(false);
    setEditId(null);
  };

  const handleModalCancel = () => {
    setVisible(false);
    setEditId(null);
  };

  const handleSubmit = async (values: ImportedData) => {
    try {
      
      if (editId) {
        // Update existing data
        await axios.put(` http://localhost:3001/api/imported-data/${editId}`, values);
      } else {
        // Create new data
        await axios.post(' http://localhost:3001/api/imported-data', values);
      }
      //handleModalOk();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />

      <Table dataSource={importedData} loading={loading}>
        <Column title="Item No" dataIndex="itemNo" key="itemNo" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Rate" dataIndex="rate" key="rate" />
        <Column title="Qty" dataIndex="qty" key="qty" />
        <Column title="Amount" dataIndex="amount" key="amount" />
        <Column
             title="Actions"
             key="actions"
             render={(text, record: ImportedData) => (
               <Space>
                 <Button type="primary" onClick={() => handleEdit(record)}>
                   Edit
                 </Button>
                 <Button type="primary" danger onClick={() => handleDelete(record)}>
                   Delete
                 </Button>
               </Space>
             )}
           />
         </Table>

         <Modal
           title={editId ? 'Edit Row' : 'Add Row'}
           visible={visible}
           onOk={handleModalOk}
           onCancel={handleModalCancel}
           footer={[
             <Button key="cancel" onClick={handleModalCancel}>
               Cancel
             </Button>,
             <Button form="dataForm" key="submit" htmlType="submit" type="primary">
               Submit
             </Button>,
           ]}
         >
           <Form
             id="dataForm"
             layout="vertical"
             onFinish={handleSubmit}
             initialValues={editId ? importedData.find((data) => data.id === editId) : {}}
           >
             <Form.Item
               label="Item No"
               name="itemNo"
               rules={[{ required: true, message: 'Please enter Item No' }]}
             >
               <Input />
             </Form.Item>

             <Form.Item
               label="Description"
               name="description"
               rules={[{ required: true, message: 'Please enter Description' }]}
             >
               <Input />
             </Form.Item>

             <Form.Item label="Rate" name="rate" rules={[{ required: true, message: 'Please enter Rate' }]}>
               <InputNumber />
             </Form.Item>

             <Form.Item label="Qty" name="qty" rules={[{ required: true, message: 'Please enter Qty' }]}>
               <InputNumber />
             </Form.Item>

             <Form.Item
               label="Amount"
               name="amount"
               rules={[{ required: true, message: 'Please enter Amount' }]}
             >
               <InputNumber />
             </Form.Item>
           </Form>
         </Modal>
       </div>
     );
   };

   export default App;

