import React from 'react';
import { withAuthSync } from '../src/utils/auth';
import Table from '../src/components/task/Table';
import ActiveTask from '../src/components/task/ActiveTask';
import { useRouter } from 'next/router';
import { Button } from 'antd';

const Task = () => {
  const content = {
    marginTop: '30px',
    marginLeft: '50px',
    marginRight: '50px',
  };

  const router = useRouter();
  let { task_name } = router.query;
  const { data, loading } = ActiveTask(task_name as string, 1, 10);

  const propsTable = {
    data: data?.listen_task?.data,
    loadData: ActiveTask,
    loading,
    meta: data?.listen_task?.meta,
  };

  return (
    <div style={content}>
      <div className="text-center mb-5">
        <div className="text-right">
          {/* <Button type="primary" size='large' onClick={() => {

          }}>
            Clean Job
          </Button> */}
        </div>
        <Table {...propsTable} />
      </div>
    </div>
  );
};

export default withAuthSync(Task);
