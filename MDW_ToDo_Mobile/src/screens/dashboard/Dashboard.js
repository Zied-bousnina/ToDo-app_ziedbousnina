/* eslint-disable prettier/prettier */
import React , { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {Text,View,StyleSheet,Image,TouchableOpacity,StatusBar,ScrollView, Touchable, FlatList, Dimensions, Pressable, TextInput, ToastAndroid} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/FontAwesome'
// import { Icon as IconPaper } from 'react-native-paper';

import { ProfitIndicator,ActionCenter } from '../../components'
import { ActivityIndicator, Avatar, Button, Card, Dialog, Drawer, IconButton, Portal, RadioButton } from 'react-native-paper'
import { Icon as IconPaper, MD3Colors } from 'react-native-paper';
import Logo from '../../components/svg/LOGO'
import LOGOwhite from '../../components/svg/LOGOwhite'
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import AddtodoForm from '../../components/AddtodoForm'
import LoginButton from '../../components/Buttons/LoginButton'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as yup from 'yup';
import CostomFormik from '../../components/costomFormik/CostomFormik'
import Fonts from '../../../src/assets/fonts';
import AppInput from '../../components/Inputs/AppInput'
import { Colors } from '../../theme'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { UserService } from '../../../_services/user.service'
import AppLoader from '../../components/Animations/AppLoader'
import { FlashList } from "@shopify/flash-list";
import ItemList from '../../components/ItemTask'
import { DatePickerInput, TimePickerModal } from 'react-native-paper-dates';
import DropDown from "react-native-paper-dropdown";
import { uniqueId } from 'lodash';
const initialValues = {
  title:"",
  description:"",

  };
  const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),

  });
  const validationSchemaUpdate = yup.object({


  });

const Dashboard = () =>{
    const [checked, setChecked] = React.useState('title');
    const sheetRef = useRef(null);
    const [whoIsClicked, setwhoIsClicked] = useState("add")
    const [active, setActive] = React.useState('');
    const user = useSelector(state=>state?.auth)
    const [AllTasks, setAllTasks] = useState([])
    const [IsloadingList, setIsloadingList] = useState(false)
    const [visible, setVisible] = React.useState(false)
    const [time, settime] = useState(null)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    // Date time handle const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    // Modal click on task
    const [visibleModalupdateOrDelete, setVisibleModalupdateOrDelete] = React.useState(false);
    const [selectedTaskId, setselectedTaskId] = useState(null);
    const [selectedItem, setselectedItem] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [currentStatistiques, setcurrentStatistiques] = useState(null)
  const [status, setstatus] = useState("");
    const DeleteTask = () => {
      console.log("selectedTaskId from DeleteTask : ", selectedTaskId);
      setIsloadingList(true)
      UserService.deleteTask(selectedTaskId)
      .then((res) => {
        const parsedRes = JSON.parse(res);
        console.log("res from DeleteTask : ", parsedRes);
        console.log("Type of res: ", typeof res);

        getTaskLis()
        getStatistique()
        setVisibleModalupdateOrDelete(false)
      setIsloadingList(true)

      })
      .catch((err) => {
        console.log("err from DeleteTask : ", err);
        setIsloadingList(false)
      })
      .finally(() => {
        setVisibleModalupdateOrDelete(false)
        setIsloadingList(false)
      })
    }

const getStatistique =()=> {
  setIsloadingList(true)
  UserService.getStatistique()
  .then((res) => {
    const parsedRes = JSON.parse(res);
    console.log("res from getStatistique : ", parsedRes);
    console.log("Type of res: ", typeof res);
    setcurrentStatistiques(parsedRes?.statistics)
    setIsloadingList(false)
  })
  .catch((err) => {
    console.log("err from getStatistique : ", err);

  })
  .finally(() => {
    setIsloadingList(false)
  })

}
console.log("currentStatistiques from Dashboard : ", currentStatistiques);
    const showDialog = () => setVisibleModalupdateOrDelete(true);

    const hideDialog = () => setVisibleModalupdateOrDelete(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    settime(date)
    hideDatePicker();
  };
    const onDismiss = React.useCallback(() => {
      setVisible(false)

    }, [setVisible])

    const onConfirm = React.useCallback(
      ({
        date
        , hours, minutes }) => {
        setVisible(false);
        console.log({ hours, minutes });
       settime(date)
      },
      [setVisible]
    );
    AsyncStorage.getItem('user')
    .then(value => {
      if (value) {
       console.log("token from dashboard : ", value);
      }
    })
    .catch(err => {
    });

    console.log("user from dashboard : ", user);
    const handleSaveTask = (values, formikActions) => {
      console.log("values from handleSaveTask : ", values);
      // formikActions.resetForm()
      const data= {
        ...values,
        due_date:time.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC'
        }).replace(',', ''),
        remind_at: time.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC'
        }).replace(',', ''),
      }
      if(!time){
        ToastAndroid
        .showWithGravityAndOffset(
          "Please pick a date",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        formikActions.resetForm()
        formikActions.setSubmitting(false);
        return
      }
      console.log("values :",data)
      setIsloadingList(true)
      UserService.AddTask(data)
      .then((res) => {
        const parsedRes = JSON.parse(res);
        console.log("res from AddTask : ", parsedRes?.data);
        console.log("Type of res: ", typeof res);
        setAllTasks([...AllTasks, parsedRes?.data])
        getTaskLis()
        getStatistique()
        setIsloadingList(false)
        sheetRef.current.close()
        formikActions.setSubmitting(false);
        formikActions.resetForm()

      })
      .catch((err) => {
        console.log("err from AddTask : ", err);
        setIsloadingList(false)
      })
      .finally(() => {
        setIsloadingList(false)

      })


          formikActions.setSubmitting(false);



      };

      const handleUpdateTask = (values, formikActions) => {
        console.log("values from handleSaveTask : ", values);
        // formikActions.resetForm()
        const data= {
          title: values?.title ? values?.title : selectedItem?.title,
          description: values?.description ? values?.description : selectedItem?.description,

          due_date: time ?  time.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC'
          }).replace(',', '') : selectedItem?.due_date,
          remind_at: time ? time.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC'
          }).replace(',', '') : selectedItem?.due_date,
          status: status ? status : selectedItem?.status
        }
  formikActions.resetForm()
  formikActions.setSubmitting(false);
        console.log("values :",data)
        setIsloadingList(true)
        UserService.updateTask(data, selectedTaskId)
        .then((res) => {
          const parsedRes = JSON.parse(res);
          console.log("res from AddTask : ", parsedRes?.data);
          console.log("Type of res+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++: ",  res);
          // setAllTasks([...AllTasks, parsedRes?.data])
          setAllTasks([])
          getTaskLis()
          getStatistique()
          // setIsloadingList(false)
          sheetRef.current.close()
          formikActions.setSubmitting(false);
          formikActions.resetForm()

        })
        .catch((err) => {
          console.log("err from AddTask : ", err);
          setIsloadingList(false)
        })
        .finally(() => {
          // setIsloadingList(false)

        })


            formikActions.setSubmitting(false);



        };

      const HandleFetchTaskBySort = () => {
        // console.log("values from handleSaveTask : ", values);
        // formikActions.resetForm()


        getTaskListBySort(checked)

      }
const getTaskLis = async () => {
  setIsloadingList(true)
UserService.getTaskList().
then((res) => {
  const parsedRes = JSON.parse(res);
  console.log("res from getTaskList : ", parsedRes?.tasks);
  console.log("Type of res: ", typeof res);

  setAllTasks(parsedRes?.tasks)
  getStatistique()
  setIsloadingList(false)

})
.catch((err) => {
  // console.log("err from getTaskList : ", err);
  setIsloadingList(false)

})
.finally(() => {
  setIsloadingList(false)
})

}

const getTaskListBySort = async (
  sortType
) => {
  setIsloadingList(true)
UserService.getTaskListSorted(
  {
    "sort_by": "status"
  }
 ).
then((res) => {
  const parsedRes = JSON.parse(res);
  console.log("res from getTaskList : ", parsedRes?.tasks);
  console.log("Type of res: ", typeof res);

  setAllTasks(parsedRes?.tasks)
  getStatistique()
  setIsloadingList(false)
  sheetRef.current.close()

})
.catch((err) => {
  // console.log("err from getTaskList : ", err);
  setIsloadingList(false)
  sheetRef.current.close()

})
.finally(() => {
  setIsloadingList(false)
  sheetRef.current.close()
})

}
useEffect(() => {

 getTaskLis()
 getStatistique()
}, [])
console.log("currentStatistiques from Dashboard : ", currentStatistiques);
const keyExtractor = useCallback((item, i)=> `${i}-${item?.id
  ?
  item?.id
  :
  uniqueId()
 }`,[]);
const renderLoader = () => {
  return  5* PAGE_LIMIT < AllTasks?.length ? (

    <View
      style={{
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // marginButtom: 30,
      }}
    >
      <ActivityIndicator size="large" color="red" />
    </View>
  ) : null;
};
const PAGE_LIMIT = 5;
const getItemLayout = (data, index) => (
  {length: PAGE_LIMIT, offset: PAGE_LIMIT * index, index}
)

const RenderItem = ({ item }) => {

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  };
  const switchColorByStatus = (status) => { // Fixed parameter name from item?.status to status
    // ['en attente', 'open', 'in progress', 'Accepted', 'solved', 'on hold']
    console.log("status from switchColorByStatus : ", status);
    switch (status) {
      case "open":
        return "#36C4BD";
      case "en attente":
      case "in progress": // Combine cases with the same return value
        return "#FFBB02";
      case "Accepted":
        return "#2563D3";
      case "solved":
        return "#7DC02A";
      case "on hold":
        return "#757174";
      default:
        return "#FFA500";
    }
  };
  const switchIconByStatus = (status) => { // Fixed parameter name from item?.status to status
    // ['en attente', 'open', 'in progress', 'Accepted', 'solved', 'on hold']
    console.log("status from switchColorByStatus : ", status);
    switch (status) {
      case "open":
        return "wallet-outline";
      case "en attente":
      case "in progress": // Combine cases with the same return value
      return "crown";
      case "Accepted":
        return "ghost";
      case "solved":
        return "history";
      case "on hold":
        return "lamp";
      default:
        return "wallet-outline";
    }
  };
  const navigateDetails= ()=> {
  }
  const Point = ({ color, size }) => {
    const styles = StyleSheet.create({
      point: {
        width: size,
        height: size,
        borderRadius: size / 2, // To make it a circle
        backgroundColor: color,
        marginRight: 10,

      },
    });

    return <View style={styles.point} />;
  };
  return (


          <>


  <Pressable style={[styles.taskContainer, {borderColor: `${switchColorByStatus(item.status)}`,}]}
       onPress={
          () => {
            setselectedItem(item)
            setselectedTaskId(item.id)
            setVisibleModalupdateOrDelete(true)


          }
       }
       >


       <View
       style={styles.tags}
        >
          <Text
          style={{
            color: "CBD5E1",
            fontFamily:"Roboto-Bold",
            fontSize:16,

          }}
          >
            <IconPaper
    source={switchIconByStatus(item.status)}
    color={"#93989C"}
    size={20}
  />
            {truncateText(item?.title, 20)}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Point color={switchColorByStatus(item.status)} size={10} />

  <Text
    style={{
      color: "#64748B",
      fontFamily: "Roboto-Bold",
      fontSize: 12,
      marginLeft: 2, // Adjust this value based on your spacing preference
    }}
  >
   {item?.status.toUpperCase()}
  </Text>
</View>

       </View>
       <View>
        <Text
        style={{
          color: "black",
          fontFamily:"Roboto-Bold",
          fontSize:16,
          marginLeft:10,
          marginTop:2,
          marginBottom:5

        }}
        >
          {truncateText(item?.description, 20)}
        </Text>

       </View>
       <View
        style={[styles.tags, {marginTop:5}]}
        >

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text
    style={{
      color: "#CBD5E1",
      fontFamily: "Roboto-Bold",
      fontSize: 12,
      marginLeft: 2, // Adjust this value based on your spacing preference
    }}
  >
    For
  </Text>

  <Text

    style={{
      color: "#64748B",
      fontFamily: "Roboto-Bold",
      fontSize: 12,
      marginLeft: 2, // Adjust this value based on your spacing preference
    }}
  >
    {"zied bousnina"}
  </Text>

</View>
 <Text
          style={{
            color: "black",
            fontFamily:"Roboto-Bold",
            fontSize:16,

          }}
          >
            <IconPaper
    source="calendar"
    color={"#93989C"}
    size={20}
  />
            {item?.due_date}
          </Text>

        </View>

        <Text
    style={{
      color: "#CBD5E1",
      fontFamily: "Roboto-Bold",
      fontSize: 12,
      marginLeft: 2, // Adjust this value based on your spacing preference
      marginTop:-10
    }}
  >
  (  Click me)
  </Text>

          </Pressable>
          {/* <Text>hets</Text> */}

          </>
      );


}
// console.log("_____________________",AllTasks)
      const navigation = useNavigation()
    return (


        <View style={{flex:1}} >
       {IsloadingList&& <AppLoader/>}
        {/* <Drawer.Section title="Some title">
      <Drawer.Item
        label="First Item"
        active={active === 'first'}
        onPress={() => setActive('first')}
      />
      <Drawer.Item
        label="Second Item"
        active={active === 'second'}
        onPress={() => setActive('second')}
      />
    </Drawer.Section> */}
    <Portal>
          <Dialog visible={visibleModalupdateOrDelete} onDismiss={hideDialog}>
            <Dialog.Title
            style={{
              color: "black",
              fontFamily:"Roboto-Bold",
              fontSize:16
            }}
            >Alert</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium"
              style={{
                color: "black",
                fontFamily:"Roboto-Bold",
                fontSize:16
              }}

              >Update or delete Task</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={DeleteTask}>Delete</Button>
              <Button onPress={()=>{
                setVisibleModalupdateOrDelete(false)

                  // navigation.navigate('UpdateTask', {selectedTaskId})
                  sheetRef.current.open()
                setwhoIsClicked("update")

                }}>Update</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

            {/* Statusbar */}
            <StatusBar barStyle='light-content' translucent={true} backgroundColor='transparent' />
            {/* Header section */}
            <LinearGradient start={{x:0.0,y:0.4}} end={{x:0.5,y:1.0}} location={[0,1]} colors={['#2D97DA','#2249D6']} style={{flex:0.8,flexDirection:'column',
            borderBottomLeftRadius:5,borderBottomRightRadius:5
            }} >
                <View style={{flexDirection:'column',marginTop:hp('5%'),paddingHorizontal:'2%'}} >
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}} >

                </View>



                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}} >
                        {/* Amount */}
                        <View style={{flexDirection:'column'}} >
                            <Text style={{color:'#fff',fontSize:28,fontFamily:'Roboto-Bold'}} > <IconButton
      icon="sort-variant"
      iconColor={"white"}
      size={30}
      onPress={() => navigation.openDrawer()}
    /></Text>
                            {/* <Text style={{color:'rgba(255,255,255,0.3)',fontFamily:'Roboto-Regular-Italic',fontSize:14}} >Updated 2 mins ago</Text> */}
                        </View>

                        {/* profit loss indicator */}
                        <LOGOwhite
                    width={Dimensions.get('window').width*0.1}
                    height={Dimensions.get('window').height*0.1}
                    />
      <IconButton
      icon="shape-square-plus"
      iconColor={"white"}
      size={30}
      onPress={() => {
        setwhoIsClicked("add")
        sheetRef.current.open()}}
    />
                </View>
            </View>

            </LinearGradient>

            {/* Body section */}
            <View style={{flex:2.5,backgroundColor:'#fff',paddingHorizontal:wp('5%')}} >
                {/* Action Center */}
                <View style={{flexDirection:'row',backgroundColor:'#fff',height:hp('13%'),width:'100%',alignItems:'center',justifyContent:'space-around',borderRadius:10,borderWidth:1,borderColor:'rgba(255,255,255,0.1)',elevation:10,shadowColor:'#000',shadowRadius:10,marginTop:-50}} >

                    {/* <TouchableOpacity style={{flexDirection:'column',alignItems:'center'}} >
                        <Image style={{height:60,width:60}} source={require('../assets/icons/top-up.png')} />
                        <Text style={{fontSize:15,fontFamily:'Roboto-Bold',color:'#333'}} >Top-up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection:'column',alignItems:'center'}} >
                        <Image style={{height:60,width:60}} source={require('../assets/icons/top-up.png')} />
                        <Text style={{fontSize:15,fontFamily:'Roboto-Bold',color:'#333'}} >Top-up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection:'column',alignItems:'center'}} >
                        <Image style={{height:60,width:60}} source={require('../assets/icons/top-up.png')} />
                        <Text style={{fontSize:15,fontFamily:'Roboto-Bold',color:'#333'}} >Top-up</Text>
                    </TouchableOpacity> */}

                    <ActionCenter stats={currentStatistiques?.overdue ?
                    currentStatistiques?.overdue : 0
                    } title_text="Overdue" />
                          <ActionCenter stats={currentStatistiques?.to_do ?
                    currentStatistiques?.to_do : 0
                          } title_text="To Do" />


                    <ActionCenter stats={currentStatistiques?.open ?
                    currentStatistiques?.open : 0
                    } title_text="open" />


                    <ActionCenter stats={currentStatistiques?.due_today ?
                    currentStatistiques?.due_today : 0
                    } title_text="Due Today" />

                </View>


                {/* My Assets */}
                <View style={{flexDirection:'column', marginTop:20, marginBottom:20}} >
                    {/* Text and button */}
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}} >
                        <Text style={{fontFamily:'Roboto-Medium',color:'#64748B',fontSize:14}} >Due today</Text>
                        <TouchableOpacity onPress={() =>{
                             setwhoIsClicked("sort by")
                             sheetRef.current.open()}}>
  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
    <Text style={{ fontFamily: 'Roboto-Medium', color: '#64748B', fontSize: 14 }}>
      Sort By
    </Text>
    <IconPaper
      source="sort-variant"
      color={"#64748B"}
      size={20}
    //   onPress={() => console.log('Pressed')}
    />
  </View>
</TouchableOpacity>

                    </View>


                    {/* Horizontal asset slider */}


                </View>


                {/* Market */}
                <View style={{flex:1,flexDirection:'column'}} >
                    {/* market text */}


                    {/* coin list */}
                    <FlashList
              showsVerticalScrollIndicator={true}


        data={AllTasks}
        renderItem={({ item }) => (
          <RenderItem

          item={item}
          />
        )}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderLoader}
        // onEndReached={async () => await getTaskLis()}
        getItemLayout={getItemLayout}
        onEndReachedThreshold={0}
        // style={{ marginBottom: 50 }}
        contentContainerStyle={{

          // marginBottom: 50
        }}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        // windowSize={5}
        initialNumToRender={5}
        estimatedItemSize={
          500
        }
        onRefresh={()=>{
          getTaskLis()
          getStatistique()
        }

        }
        refreshing={
          // false
         IsloadingList
        }
        // inverted

      />

                </View>


                <BottomSheet ref={sheetRef} closeOnDragDown={true}
                height={ (whoIsClicked == "add" || whoIsClicked=="update") ? Dimensions.get("screen").height*0.8
                :
                Dimensions.get("screen").height*0.4
                }
                 >



      {
        whoIsClicked == "add" ?
        <>
        <CostomFormik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSaveTask}
        >
        <View style={styles.socialButtonsContainer}>

    {/* <GoogleSvg width={20} height={20} /> */}

    <Text
   style={{
    color:"black",
    fontSize:16,
        // margin:20,
        fontWeight:"bold"
   }}
   >
    New item :
   </Text>


  <View >

  <View style={styles.socialButton}>
    {/* <GoogleSvg width={20} height={20} /> */}
    <Pressable
    onPress={()=>{



    }}
    >
      <Text style={styles.socialButtonLabel}> Clean</Text>
    </Pressable>
  </View>
  </View>
</View>

        <View style={styles.container}>

          <View style={[styles.formCon, {margin:20}]}>
            <View style={[styles.textBoxCon]}>
              {/* <View style={styles.at}> */}
                {/* <AtSVG width={20} height={20} /> */}
              {/* </View> */}
              <View style={styles.textCon}>
              <Text
              style={{
                color: "#1E293B",
                fontFamily: Fonts.type.NotoSansMedium,
                fontSize: 18,
                marginLeft:8,
                marginTop:10

              }}
              >
               Title
              </Text>
                <AppInput
                  name="title"
                  placeholder="add a title"
                  style={styles.textInput}


                  placeholderTextColor={'#aaa'}
                  />
              </View>
            </View>
{/* Title item 2 */}
            <View style={styles.textBoxCon}>
              {/* <View style={styles.at}> */}
                {/* <AtSVG width={20} height={20} /> */}
              {/* </View> */}
              <View style={styles.textCon}>
              <Text
              style={{
                color: "#1E293B",
                fontFamily: Fonts.type.NotoSansMedium,
                fontSize: 18,
                marginLeft:8,
                marginTop:10

              }}
              >
                Description
              </Text>
                <AppInput
                  name="description"
                  placeholder="Add a description"
                  style={styles.textInput}


                  placeholderTextColor={'#aaa'}
                  />
              </View>
            </View>




            {/* Title item 2 */}
            <View style={styles.textBoxCon}>
              {/* <View style={styles.at}> */}
                {/* <AtSVG width={20} height={20} /> */}
              {/* </View> */}
              <View style={styles.textCon}>
              <Text
              style={{
                color: "#1E293B",
                fontFamily: Fonts.type.NotoSansMedium,
                fontSize: 18,
                marginLeft:8,
                marginTop:10

              }}
              >
                Date item
              </Text>
              <TextInput
        style={styles.textInput}
        value={ time?.toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'UTC'
})




        }
        placeholder="Pick a date"
        onFocus={showDatePicker}
        // onBlur={showDatePicker}
        OnClick={showDatePicker}
        // onChangeText={handleChange('date')}


      />
              <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
              </View>
            </View>






          <View style={styles.loginCon}>



              {/* <Pressable
              onPress={() => {
                onPressSimpleUser()
                console.log("don't")}}
              >

              <Text style={styles.dontHaveAccountLbl}>Don't have an account yet?</Text>
              </Pressable> */}
          </View>




        </View>
        </View>
        <View style={styles.socialButtonsContainer}>
  <View style={styles.socialButton}>
    {/* <GoogleSvg width={20} height={20} /> */}
    <Pressable
    onPress={()=>sheetRef.current.close()}
    >
      <Text style={styles.socialButtonLabel}> Cancel</Text>
    </Pressable>
  </View>
  <View >

  <LoginButton
              style={{
                // flexDirection: 'row',
        // backgroundColor: "white",
        // justifyContent: 'center',
        // paddingVertical: 10,
        borderRadius: 8,
        paddingHorizontal: 30, // Adjust the padding as needed
        borderWidth:0.5,
        borderColor: "#708090",
        height: 45,
        marginTop:0,
        color:"white"

              }}
            //   loginBtnLbl={styles.loginBtnLbl}
              btnName={"Confirm"}
              />
  </View>
</View>
      </CostomFormik>
        </>
        :  whoIsClicked == "sort by" ?
   <>
   <Text
   style={{
    color:"black",
    fontSize:16,
        margin:20,
        fontWeight:"bold"
   }}
   >
    Sort By :
   </Text>
      <View style={{flexDirection:'column', marginTop:5, marginBottom:5}} >

                    {/* Text and button */}
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:23.5, marginRight:23.5}} >
                        <Text style={{fontFamily:'Roboto-Medium',color:'#334155',fontSize:20}} >Name</Text>
                        <TouchableOpacity onPress={() =>{
                             setwhoIsClicked("sort by")
                             sheetRef.current.open()}}>
  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
  <RadioButton
        value="title"
        status={ checked === 'title' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('title')}


      />
  </View>
</TouchableOpacity>

                    </View>


                    {/* Horizontal asset slider */}


                </View>
      <View style={{flexDirection:'column', marginTop:5, marginBottom:5}} >
                    {/* Text and button */}
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:23.5, marginRight:23.5}} >
                        <Text style={{fontFamily:'Roboto-Medium',color:'#334155',fontSize:20}} >Status</Text>
                        <TouchableOpacity onPress={() =>{
                             setwhoIsClicked("sort by")
                             sheetRef.current.open()}}>
  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
  <RadioButton
        value="status"
        status={ checked === 'status' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('status')}


      />
  </View>
</TouchableOpacity>

                    </View>


                    {/* Horizontal asset slider */}


                </View>

      <View style={{flexDirection:'column', marginTop:5, marginBottom:5}} >
                    {/* Text and button */}
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:23.5, marginRight:23.5}} >
                        <Text style={{fontFamily:'Roboto-Medium',color:'#334155',fontSize:20}} >Recieved</Text>
                        <TouchableOpacity onPress={() =>{
                             setwhoIsClicked("sort by")
                             sheetRef.current.open()}}>
  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
  <RadioButton
        value="due_date"
        status={ checked === 'due_date' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('due_date')}


      />
  </View>
</TouchableOpacity>

                    </View>


                    {/* Horizontal asset slider */}


                </View>
                <View style={styles.socialButtonsContainer}>
  <View style={styles.socialButton}>
    {/* <GoogleSvg width={20} height={20} /> */}
    <Pressable
    onPress={()=>sheetRef.current.close()}
    >
      <Text style={styles.socialButtonLabel}> Cancel</Text>
    </Pressable>
  </View>

  <View style={[styles.socialButton, {
     backgroundColor:"#023AE9"
  }]}>

    <Pressable
    onPress={HandleFetchTaskBySort}
    >
      <Text style={[styles.socialButtonLabel, {

color:"#ffffff"
      }]}>Confirm</Text>
    </Pressable>
  </View>
</View>
   </> :
   <>
        <CostomFormik
        initialValues={initialValues}
        validationSchema={validationSchemaUpdate}
        onSubmit={handleUpdateTask}
        >
        <View style={styles.socialButtonsContainer}>

    {/* <GoogleSvg width={20} height={20} /> */}

    <Text
   style={{
    color:"black",
    fontSize:16,
        // margin:20,
        fontWeight:"bold"
   }}
   >
    Update item :
   </Text>


  <View >

  <View style={styles.socialButton}>
    {/* <GoogleSvg width={20} height={20} /> */}
    <Pressable
    onPress={()=>{



    }}
    >
      <Text style={styles.socialButtonLabel}> Clean</Text>
    </Pressable>
  </View>
  </View>
</View>

        <View style={styles.container}>

          <View style={[styles.formCon, {margin:20}]}>
            <View style={[styles.textBoxCon]}>
              {/* <View style={styles.at}> */}
                {/* <AtSVG width={20} height={20} /> */}
              {/* </View> */}
              <View style={styles.textCon}>
              <Text
              style={{
                color: "#1E293B",
                fontFamily: Fonts.type.NotoSansMedium,
                fontSize: 18,
                marginLeft:8,
                marginTop:10

              }}
              >
               Title (pre : {selectedItem?.title})
              </Text>
                <AppInput
                  name="title"
                  placeholder="add a title"
                  style={styles.textInput}
                  defaultValue={selectedItem?.title}


                  placeholderTextColor={'#aaa'}
                  />
              </View>
            </View>
{/* Title item 2 */}
            <View style={styles.textBoxCon}>
              {/* <View style={styles.at}> */}
                {/* <AtSVG width={20} height={20} /> */}
              {/* </View> */}
              <View style={styles.textCon}>
              <Text
              style={{
                color: "#1E293B",
                fontFamily: Fonts.type.NotoSansMedium,
                fontSize: 18,
                marginLeft:8,
                marginTop:10

              }}
              >
                Description (pre : {selectedItem?.description})
              </Text>
                <AppInput
                  name="description"
                  placeholder="Add a description"
                  style={styles.textInput}


                  placeholderTextColor={'#aaa'}
                  />
              </View>
            </View>




            {/* Title item 2 */}
            <View style={styles.textBoxCon}>
              {/* <View style={styles.at}> */}
                {/* <AtSVG width={20} height={20} /> */}
              {/* </View> */}
              <View style={styles.textCon}>
              <Text
              style={{
                color: "#1E293B",
                fontFamily: Fonts.type.NotoSansMedium,
                fontSize: 18,
                marginLeft:8,
                marginTop:10

              }}
              >
                Date  item (pre : {selectedItem?.due_date})
              </Text>
              <TextInput
        style={styles.textInput}
        value={ time?.toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'UTC'
})




        }
        placeholder="Pick a date"
        onFocus={showDatePicker}
        // onBlur={showDatePicker}
        OnClick={showDatePicker}
        // onChangeText={handleChange('date')}


      />
              <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
              </View>
              <View style={styles.textCon}>
              <Text
              style={{
                color: "#1E293B",
                fontFamily: Fonts.type.NotoSansMedium,
                fontSize: 18,
                marginLeft:8,
                marginTop:10

              }}
              >
                Status (pre : {selectedItem?.status})
              </Text>
              <DropDown
              label={"Status"}
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={status}
              setValue={setstatus}
             dropDownItemStyle={
              {
                color:"black"
              }
             }
              list={

                ['en attente', 'open', 'in progress', 'Accepted', 'solved', 'on hold'].map((item, index) => ({ label: item, value: item }))

              }
            />
              <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
              </View>
            </View>






          <View style={styles.loginCon}>



              {/* <Pressable
              onPress={() => {
                onPressSimpleUser()
                console.log("don't")}}
              >

              <Text style={styles.dontHaveAccountLbl}>Don't have an account yet?</Text>
              </Pressable> */}
          </View>




        </View>
        </View>
        <View style={styles.socialButtonsContainer}>
  <View style={styles.socialButton}>
    {/* <GoogleSvg width={20} height={20} /> */}
    <Pressable
    onPress={()=>sheetRef.current.close()}
    >
      <Text style={styles.socialButtonLabel}> Cancel</Text>
    </Pressable>
  </View>
  <View >

  <LoginButton
              style={{
                // flexDirection: 'row',
        // backgroundColor: "white",
        // justifyContent: 'center',
        // paddingVertical: 10,
        borderRadius: 8,
        paddingHorizontal: 30, // Adjust the padding as needed
        borderWidth:0.5,
        borderColor: "#708090",
        height: 45,
        marginTop:0,
        color:"white"

              }}
            //   loginBtnLbl={styles.loginBtnLbl}
              btnName={"Confirm"}
              />
  </View>
</View>
      </CostomFormik>
        </>

      }
                   </BottomSheet>

            </View>

        </View>
    );
}

export default Dashboard

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tags2: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tags3: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding:10,
    marginRight:10
  },
  taskContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 8,
    margin: 5,
    shadowColor: '#000',
    borderLeftWidth: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20, // Add some margin if needed
        marginTop: 10, // Adjust as needed
      },
      socialButton: {
        flexDirection: 'row',
        backgroundColor: "white",
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        paddingHorizontal: 40, // Adjust the padding as needed
        borderWidth:0.5,
        borderColor: "#708090",
        height: 45,
      },

      socialButtonLabel: {
        color: "black",
        textAlign: 'center',
        paddingHorizontal: 10, // Adjust the padding as needed
        // fontFamily: Fonts.type.NotoSansBlack,
      },
      textInput: {
        borderBottomColor: Colors["light"]?.gray,
        borderWidth: 0.5,
        // borderTopWidth: 0,
        // borderLeftWidth: 0,
        // borderRightWidth: 0,
        color: Colors["light"]?.black,
        fontSize: 16,
        fontFamily: Fonts.type.NotoSansMedium,
        height: 40,
        borderRadius: 8,
        backgroundColor:"#ffffff",
        paddingHorizontal: 10,
        marginTop:10

        // backgroundColor: "#ffffff",
      },
})