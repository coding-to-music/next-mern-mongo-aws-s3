import React, { useState, useEffect } from 'react';
import { Form, Col, Row, Card, Accordion, Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { MdDelete, MdEdit } from 'react-icons/md';
import { apiUrl, axiosCallApi } from '../../../../config/api';
import CourseAddVideoForm from '../../Courses/Components/CourseAddVideoForm';

const AddVideoCourse = ({ showAddVideo, hideAddVideo, courseId, submit, _loading }) => {
  const { register, handleSubmit } = useForm();
  const [validVideo, setvalidVideo] = useState(false);
  const [videoList, setVideoList] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    submit(values);
  };

  const toggleValidVideo = () => {
    setvalidVideo(true);
  };

  const onSubmitVideoEdit = (values, id) => {
    setLoading(true);
    axiosCallApi
      .patch(
        `${apiUrl}/courses/video/${courseId}`,
        {
          title: values.title,
          description: values.description,
          isPreviable: values.isPreviable,
          isIntro: values.isIntro,
          _id: id
        },
        {
          headers: { authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        }
      )
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          fetchVideos();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchVideos = () => {
    setLoading(true);
    axiosCallApi.get(`${apiUrl}/courses/${courseId}`).then((response) => {
      setVideoList(response.data.course.videos);
      setLoading(false);
    });
  };

  const deleteVideo = (_id, key) => {
    setLoading(true);
    axiosCallApi
      .post(
        `${apiUrl}/courses/video/delete/${_id}`,
        { id: courseId, key },
        {
          headers: { authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        }
      )
      .then(() => {
        fetchVideos();
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVideos();
  }, [courseId]);

  return (
    <>
      <Modal show={showAddVideo} onHide={hideAddVideo} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>???????????????? ????????????</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs="12" xl="6">
              <Form onSubmit={handleSubmit(onSubmit)} id="addVideoCourse-form">
                {/* ???????????? */}
                <Form.Group>
                  <Form.Label>????????????</Form.Label>
                  <Form.File
                    id="custom-video"
                    label="?????????????? ?????? ????????????"
                    custom
                    isValid={validVideo}
                    onChange={toggleValidVideo}
                    ref={register()}
                    name="video"
                  />
                  {validVideo ? (
                    <p style={{ color: '#28a745' }}>Video uploaded!</p>
                  ) : null}
                </Form.Group>
                {/* ???????????? ???????????? */}
                <Form.Group>
                  <Form.Label>???????????? ????????????</Form.Label>
                  <Form.Control
                    ref={register()}
                    type="text"
                    placeholder="????????????"
                    name="title"
                  />
                </Form.Group>
                {/* ?????????????????? ?????????????????? */}
                <Form.Group>
                  <Form.Label>?????????????????? ????????????</Form.Label>
                  <Form.Control
                    ref={register()}
                    type="text"
                    placeholder="??????????????????"
                    name="desription"
                  />
                </Form.Group>
                {/* ???????????????? ???????? ???????????????????? */}
                <Form.Group>
                  <Form.Label>???????????????? ???????? ????????????????????</Form.Label>
                  <Form.Control
                    as="select"
                    ref={register()}
                    type="text"
                    placeholder="????????????????"
                    name="isIntro"
                  >
                    <option value="true">??????</option>
                    <option value="false">??????</option>
                  </Form.Control>
                </Form.Group>
                {/* ???????????? ???? ???????????? ???????? ???????????????????? */}
                <Form.Group>
                  <Form.Label>???????????? ???? ???????????? ???????? ????????????????????</Form.Label>
                  <Form.Control
                    as="select"
                    ref={register()}
                    type="text"
                    placeholder="????????????"
                    name="isPreviable"
                  >
                    <option value="true">??????</option>
                    <option value="false">??????</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Col>
            <Col xs="12" xl="6" style={{ overflowY: 'scroll' }}>
              {videoList?.map((data) => {
                return (
                  <div key={data._id}>
                    <Accordion defaultActiveKey="0">
                      <Card className="mb-1">
                        {/* CARD HEADER  */}
                        <Card.Header>
                          <Row className="justify-content-space-between align-items-center">
                            <Col>{data.title}</Col>
                            <Col className="justify-content-end d-flex">
                              <div className="hover mr-2">
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                  <MdDelete
                                    className="ml-auto text-danger"
                                    style={{ fontSize: '21px' }}
                                  />
                                </Accordion.Toggle>
                              </div>
                              <div className="hover">
                                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                  <MdEdit
                                    className="ml-auto text-primary"
                                    style={{ fontSize: '21px' }}
                                  />
                                </Accordion.Toggle>
                              </div>
                            </Col>
                          </Row>
                        </Card.Header>
                        {/* DELETE VIDEO */}
                        <Accordion.Collapse eventKey="1">
                          <Card.Body className="text-center">
                            ???????????? ?????????????? ???? ???????????????????? ???? ????????????;
                            <Button
                              className="mt-1"
                              variant="danger"
                              block
                              onClick={() => deleteVideo(data._id, data.key)}
                              disabled={loading}
                            >
                              {loading ? '????????????????????' : '????????????????'}
                            </Button>
                          </Card.Body>
                        </Accordion.Collapse>
                        {/* EDIT VIDEO */}
                        <Accordion.Collapse eventKey="2">
                          <CourseAddVideoForm
                            data={data}
                            onSubmitVideoEdit={onSubmitVideoEdit}
                            _loading={loading}
                          />
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </div>
                );
              })}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideAddVideo}>
            ????????????
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="addVideoCourse-form"
            disabled={_loading}
          >
            {_loading ? <>????????????????????</> : <>???????????????????? ????????????</>}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddVideoCourse;
