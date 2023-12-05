const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const bcrypt = require('bcrypt');
const salt = 10;
const emailjs = require("@emailjs/nodejs");
require('dotenv').config();
//for todays date
const currentDate = new Date();
//for adding months
// const currentDate = new Date(new Date().setMonth(new Date().getMonth() + 70));
console.log(currentDate)
//for adding day and month
// const today = new Date(new Date().setMonth(new Date().getMonth() + 12));
// const currentDate = new Date(
//   new Date(today.getFullYear(), today.getMonth(), 60)
// );

const createdAt = currentDate.toISOString().slice(0, 19).replace("T", " ");

console.log(process.env.HOST_KEY)

// console.log(process.env.HOST_KEY);

app.use(cors());
app.use(express.json());

app.listen(19001, () => {
  console.log("running");
});

// //mysql local connection
// const db = mysql.createConnection({
//   //local database
//   host: "localhost",
//   user: "root",
//   password: "",
//   // //old db
//   // database: "samplebias",

//   //new db
//   database: "biasdatabase",
// });


//mysql online connection
const db = mysql.createConnection({
  host: process.env.HOST_KEY,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/", (req, res) => {
  return res.json("From Server");
});

/////FINAL SQL
app.post("/signupFinal", (req, res) => {

  var datee = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var hr = new Date().getHours();
  var min = new Date().getMinutes();
  var secs = new Date().getSeconds();

  // You can turn it in to your desired format
  var createdAt = year + '-' + month + '-' + datee + ' ' + hr + ':' + min + ':' + secs;//format: d-m-y;


  const userType = req.body.userType;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.middleName;
  const bDate = req.body.bDate;
  const parsedDate = new Date(bDate);
  const formattedDate = parsedDate.toISOString().split('T')[0];
  const gender = req.body.gender.toLowerCase();
  const userage = req.body.userage;
  const contactNum = req.body.contactNum;
  const email = req.body.email;
  const pass = req.body.pass;
  const hash = bcrypt.hashSync(pass, salt);
  const provinceData = req.body.selectedProvince;
  const cityData = req.body.selectedCity;
  const brgyData = req.body.selectedBrgy;
  // const createdAt = req.body.createdAt;


  db.query(
    "INSERT INTO usertbl (user_type, user_fname, user_lname, user_mname, user_bdate, user_gender, user_age, user_contact_num, user_email, user_password, user_province, user_city, user_barangay, user_created_at ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
    [userType, firstName, lastName, middleName, formattedDate, gender, userage, contactNum, email, hash,  provinceData, cityData, brgyData,createdAt],
(error, results) => {
  if (error) {
    console.log(error);
    return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})



  } else {
    // res.send(results);
    return res.send({ success: true, results})

  }
}
);

});



app.post("/pitchFinal", (req, res) => {
const user = req.body.user;
const businessName = req.body.businessName;
const businessTypeSelectd = req.body.businessTypeSelectd;
const bussNameSelectd = req.body.bussNameSelectd;
const address = req.body.selectedProvince + ", " + req.body.selectedCity + ", " + req.body.selectedBrgy;
const imageURL =  req.body.imageURL;
const checkboxDataAdd =  req.body.bussStationYN;
const customTextAdd =  req.body.bussLocationAdd;
const checkboxExperience =  req.body.bussExperienceYN;
const customTextExp =  req.body.businesstExp;
const summary =  req.body.bussSummary;
const audience =  req.body.bussAudience;
const funds =  req.body.bussFunds;
const suppDoc =  req.body.buss_support_doc;
const businessCapital = req.body.businessCapital;
const credential = req.body.fileURL;
const month = 6;
const interest = 5;
const loanreturn = req.body.loanreturn;
const installment = req.body.installments;
const status = "pending"
// const createdAt =  req.body.createdAt;



  db.query(
    "INSERT INTO business (buss_name, buss_type, buss_type_name, buss_address, buss_photo, buss_station, buss_station_name, buss_experience, buss_prev_name, buss_summary, buss_target_audience, buss_useof_funds, buss_support_doc,  buss_capital,  buss_credentials, buss_no_of_months,  buss_interest, buss_loan_return,buss_installment, buss_status, buss_created_at, buss_user_id ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [businessName, businessTypeSelectd,  bussNameSelectd, address, imageURL, checkboxDataAdd, customTextAdd, checkboxExperience, customTextExp, summary,  audience, funds, JSON.stringify(suppDoc),  businessCapital, JSON.stringify(credential) , month, interest, loanreturn, JSON.stringify(installment), status, createdAt, user],
(error, results) => {
  if (error) {
    console.log(error);
  } else {
    res.send(results);
  }
}
);

});


app.post("/getIdFinal", (req, res) => {
  const id = req.body.user;

  db.query(
        "select * from usertbl inner join user_identity on usertbl.user_id = user_identity.user_identity_user_id where user_id = ?",
        // "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where user_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log("getIdFinal");

        console.log(error);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});





app.get("/getInvestorsFeedsFinal", (req, res) => {
  const userType = "entrepreneur";
  const status = "approved";
  db.query(
    "select business.*, usertbl.* ,businessapproved.*,  investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname , investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where buss_status = ? and usertbl.user_type = ?",
    [status, userType],
    (error, result) => {
      if (error) {
        return res.send({ success: false, error: error });
      } else {
        const businessWithInvestment = [];

        const resultsSet = result;

        resultsSet.forEach((row) => {
          let business = businessWithInvestment.find(
            (item) => item.buss_id === row.buss_id
          );

          if (!business) {
            business = {
              buss_id: row.buss_id,
              buss_name: row.buss_name,
              buss_type: row.buss_type,
              buss_type_name: row.buss_type_name,
              buss_address: row.buss_address,
              buss_photo: row.buss_photo,
              buss_station: row.buss_station,
              buss_station_name: row.buss_station_name,
              buss_experience: row.buss_experience,
              buss_prev_name: row.buss_prev_name,
              buss_summary: row.buss_summary,
              buss_target_audience: row.buss_target_audience,
              buss_useof_funds: row.buss_useof_funds,
              buss_capital: row.buss_capital,
              buss_approved_updated_year: row.buss_approved_updated_year,
              buss_approved_percent: row.buss_approved_percent,
              buss_created_at:row.buss_created_at,
              buss_status: row.buss_status,
              totalAmountInvts:row.totalAmountInvts,

              user_profile: row.user_profile,
              user_id: row.user_id,
              user_fname: row.user_fname,
              user_lname: row.user_lname,
              investments: [],
            };
            businessWithInvestment.push(business);
          }

          business.investments.push({
            investor_id: row.investor_id,
            investor_profile: row.investor_profile,
            investor_fname: row.investor_fname,
            investor_lname: row.investor_lname,
            invest_amount: row.invst_amt,
          });
        });

        return res.send({
          success: true,
          result: businessWithInvestment,
          filterData: businessWithInvestment,
        });
      }
    });
});



// app.post("/ViewBussiness", (req, res) => {
//   const userType = "entrepreneur";
//   const status = "approved";
//   const id = req.body.bussID;

//   db.query(
//     "select business.*, usertbl.* ,businessapproved.*,  investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,  investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where buss_status = ? and usertbl.user_type = ? and business.buss_id = ?",
//     [status, userType, id],
//     (error, result) => {
//       if (error) {
//         return res.send({ success: false, error: error });
//       } else {
//         const businessWithInvestment = [];

//         const resultsSet = result;

//         resultsSet.forEach((row) => {
//           let business = businessWithInvestment.find(
//             (item) => item.buss_id === row.buss_id
//           );

//           if (!business) {
//             business = {
//               buss_id: row.buss_id,
//               buss_name: row.buss_name,
//               buss_type: row.buss_type,
//               buss_type_name: row.buss_type_name,
//               buss_address: row.buss_address,
//               buss_photo: row.buss_photo,
//               buss_station: row.buss_station,
//               buss_station_name: row.buss_station_name,
//               buss_experience: row.buss_experience,
//               buss_prev_name: row.buss_prev_name,
//               buss_summary: row.buss_summary,
//               buss_target_audience: row.buss_target_audience,
//               buss_useof_funds: row.buss_useof_funds,
//               buss_capital: row.buss_capital,
//               buss_approved_updated_year: row.buss_approved_updated_year,
//               buss_approved_percent: row.buss_approved_percent,
//               buss_created_at:row.buss_created_at,
//               buss_status: row.buss_status,
//               totalAmountInvts:row.totalAmountInvts,
              

//               user_profile: row.user_profile,
//               user_id: row.user_id,
//               user_fname: row.user_fname,
//               user_lname: row.user_lname,
//               investments: [],
//             };
//             businessWithInvestment.push(business);
//           }

//           business.investments.push({
//             investor_id: row.investor_id,
//             investor_profile: row.investor_profile,
//             investor_fname: row.investor_fname,
//             investor_lname: row.investor_lname,
//             invest_amount: row.invst_amt,
//             invest_returned_amount : row.invst_returned_amt,
//             invst_buss_approved_buss_id: row.invst_buss_approved_buss_id
//           });
//         });

//         return res.send({
//           success: true,
//           result: businessWithInvestment,
//           filterData: businessWithInvestment,
//         });
//       }
//     });
// });

app.post("/ViewBussinessEntrep", (req, res) => {
  const userType = "entrepreneur";
  const status = "start";
  const id = req.body.bussID;

  db.query(
    "select business.*, usertbl.* ,businessapproved.*,  investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,  investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where usertbl.user_type = ? and business.buss_id = ?",
    [userType, id],
    (error, result) => {
      if (error) {
        return res.send({ success: false, error: error });
      } else {
        const businessWithInvestment = [];

        const resultsSet = result;

        resultsSet.forEach((row) => {
          let business = businessWithInvestment.find(
            (item) => item.buss_id === row.buss_id
          );

          if (!business) {
            business = {
              buss_id: row.buss_id,
              buss_name: row.buss_name,
              buss_type: row.buss_type,
              buss_type_name: row.buss_type_name,
              buss_address: row.buss_address,
              buss_photo: row.buss_photo,
              buss_station: row.buss_station,
              buss_station_name: row.buss_station_name,
              buss_experience: row.buss_experience,
              buss_prev_name: row.buss_prev_name,
              buss_summary: row.buss_summary,
              buss_target_audience: row.buss_target_audience,
              buss_useof_funds: row.buss_useof_funds,
              buss_capital: row.buss_capital,
              buss_approved_updated_year: row.buss_approved_updated_year,
              buss_approved_percent: row.buss_approved_percent,
              buss_created_at:row.buss_created_at,
              buss_status: row.buss_status,
              totalAmountInvts:row.totalAmountInvts,
              

              user_profile: row.user_profile,
              user_id: row.user_id,
              user_fname: row.user_fname,
              user_lname: row.user_lname,
              investments: [],
            };
            businessWithInvestment.push(business);
          }

          business.investments.push({
            investor_id: row.investor_id,
            investor_profile: row.investor_profile,
            investor_fname: row.investor_fname,
            investor_lname: row.investor_lname,
            invest_amount: row.invst_amt,
            invest_returned_amount : row.invst_returned_amt,
            invst_buss_approved_buss_id: row.invst_buss_approved_buss_id
          });
        });

        return res.send({
          success: true,
          result: businessWithInvestment,
          filterData: businessWithInvestment,
        });
      }
    });
});

app.post("/ViewBussiness", (req, res) => {
  const userType = "entrepreneur";
  const status = "approved";

  const Bussid = req.body.buss_id;
  const id = req.body.user_id;


  //To check if business is new or not
  const isItemNew = (created_at) => {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const createdDate = new Date(created_at);

    return createdDate >= oneMonthAgo && createdDate <= currentDate;
  };

  //To calulcate to invest
  const calculateTotalInvest = (investment) => {
    const investDetails = investment.map((item) => item.invest_amount);

    let totalSum = 0;

    for (let i = 0; i < investDetails.length; i++) {
      totalSum += parseFloat(investDetails[i]);
    }
    if (totalSum) {
      return totalSum;
    } else {
      return 0;
    }
  };
  //Functuon for recomeneded
  const removeDuplicateBussID = (array) => {
    const seenIds = {};
    const duplicates = [];
    const uniqueItems = [];
    for (const item of array) {
      const id = item.buss_id;

      if (seenIds[id]) {
        duplicates.push(id);
      } else {
        seenIds[id] = true;
        uniqueItems.push(item);
      }
    }

    return uniqueItems;
  };

  db.query(
    "select * from user_business_likes where userbusslikes_user_id = ? ",
    id,
    (errors, resultsLike) => {
      if (errors) {
        console.log(errors);
        return res.send({ status: false, message: errors.message });
      } else {
        db.query(
          "select business.*, usertbl.* ,businessapproved.*, investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where buss_status = ? and usertbl.user_type = ? and business.buss_id = ?",
          [status, userType, Bussid],
          (error, result) => {
            if (error) {
              return res.send({ success: false, error: error });
            } else {
              const businessWithInvestment = [];

              const resultsSet = result;

              resultsSet.forEach((row) => {
                let business = businessWithInvestment.find(
                  (item) => item.buss_id === row.buss_id
                );

                if (!business) {
                  business = {
                    buss_id: row.buss_id,
                    buss_name: row.buss_name,
                    buss_type: row.buss_type,
                    buss_type_name: row.buss_type_name,
                    buss_address: row.buss_address,
                    buss_photo: row.buss_photo,
                    buss_station: row.buss_station,
                    buss_station_name: row.buss_station_name,
                    buss_experience: row.buss_experience,
                    buss_prev_name: row.buss_prev_name,
                    buss_summary: row.buss_summary,
                    buss_target_audience: row.buss_target_audience,
                    buss_useof_funds: row.buss_useof_funds,
                    buss_capital: row.buss_capital,
                    buss_created_at: row.buss_created_at,
                    isNew: isItemNew(new Date(row.buss_approved_created_at)),
                    buss_approved_updated_month:
                      row.buss_approved_updated_month,
                    buss_approved_percent: row.buss_approved_percent,

                    totalAmountInvts:row.totalAmountInvts,
                    user_profile: row.user_profile,
                    user_id: row.user_id,
                    user_fname: row.user_fname,
                    user_lname: row.user_lname,
                    investments: [],
                  };
                  businessWithInvestment.push(business);
                } else {
                  business.isNew = isItemNew(
                    new Date(row.buss_approved_created_at)
                  );
                }

                business.investments.push({
                  investor_id: row.investor_id,
                  investor_profile: row.investor_profile,
                  investor_fname: row.investor_fname,
                  investor_lname: row.investor_lname,
                  invest_amount: row.invst_amt,
                });
              });

            //To get the data if business that investments amount are not equal to the capital
            const data = businessWithInvestment.filter((item) => {
              if (
                item.buss_capital !== calculateTotalInvest(item.investments)
              ) {
                return item;
              }
            });
            //Business that has an investors
            const withInvestors = data.filter((item) => {
              const investments = item.investments;

              if (
                Array.isArray(investments) &&
                investments.some((data) => data.investor_id)
              ) {
                return true;
              }

              return false;
            });
            if (resultsLike.length > 0) {
              const likedTypesString = resultsLike[0].userbusslikes_data;
              const likedTypes = JSON.parse(likedTypesString);

              const filteredBusinessArray = data.filter((business) => {
                const businessTypes = JSON.parse(business.buss_type_name);

                return likedTypes.some((likedType) =>
                  businessTypes.includes(likedType.name)
                );
              });
              const recomended = removeDuplicateBussID([
                ...withInvestors,
                ...filteredBusinessArray,
                ...businessWithInvestment
              ]);

              //Result of this is for the recommended
              //It works by joining withInvestors and the filteredBusiessArray and return a data which are not duplicated

              return res.send({
                success: true,
                result: businessWithInvestment,
                filterData: data,
                likesofInvestors: resultsLike,
                hasLikes: true,
                withInvestors,
                recomended,
              });
            } else {
              return res.send({
                success: true,
                result: businessWithInvestment,
                filterData: data,
                // likesofInvestors: resultsLike,
                hasLikes: false,

                withInvestors,
              });
            }
            //For investor likes business
          }
        }
      );
    }
  }
);
});


app.post("/ViewInvestedBussiness", (req, res) => {
  const id = req.body.user;

  db.query(
    "select business.*, usertbl.* ,businessapproved.*,  investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,  investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id where invst_user_id = ? order by invst_id desc",
    [id],
    (error, result) => {
      if (error) {
        return res.send({ success: false, error: error });
      } else {
        const businessWithInvestment = [];

        const resultsSet = result;

        resultsSet.forEach((row) => {
          let business = businessWithInvestment.find(
            (item) => item.buss_id === row.buss_id
          );

          if (!business) {
            business = {
              buss_id: row.buss_id,
              buss_name: row.buss_name,
              buss_type: row.buss_type,
              buss_type_name: row.buss_type_name,
              buss_address: row.buss_address,
              buss_photo: row.buss_photo,
              buss_station: row.buss_station,
              buss_station_name: row.buss_station_name,
              buss_experience: row.buss_experience,
              buss_prev_name: row.buss_prev_name,
              buss_summary: row.buss_summary,
              buss_target_audience: row.buss_target_audience,
              buss_useof_funds: row.buss_useof_funds,
              buss_capital: row.buss_capital,
              buss_approved_updated_year: row.buss_approved_updated_year,
              buss_approved_percent: row.buss_approved_percent,
              buss_created_at:row.buss_created_at,
              buss_status: row.buss_status,
              totalAmountInvts:row.totalAmountInvts,
              buss_approved_updated_month: row.buss_approved_updated_month,
              invst_amt:row.invst_amt,
              invst_returned_amt:row.invst_returned_amt,
              invst_interest_sum:row.invst_interest_sum,

              

              user_profile: row.user_profile,
              user_id: row.user_id,
              user_fname: row.user_fname,
              user_lname: row.user_lname,
              investments: [],
            };
            businessWithInvestment.push(business);
          }

          business.investments.push({
            investor_id: row.investor_id,
            invst_id: row.invst_id,
            investor_profile: row.investor_profile,
            investor_fname: row.investor_fname,
            investor_lname: row.investor_lname,
            invest_amount: row.invst_amt,
            invest_returned_amount : row.invst_returned_amt,
            invst_buss_approved_buss_id: row.invst_buss_approved_buss_id,
            invst_interest_sum:row.invst_interest_sum,

          });
        });

        return res.send({
          success: true,
          result: businessWithInvestment,
          filterData: businessWithInvestment,
        });
      }
    });
});


app.post("/investmentView", (req, res) => {
  const user_id = req.body.user_id;
  const todayDate = currentDate;
  db.query(
    "select investment.*, business.*, businessapproved.*, usertbl.user_fname,usertbl.user_id ,usertbl.user_profile,usertbl.user_lname, usertbl.user_mname  from investment inner join businessapproved on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id inner join business on businessapproved.buss_approved_buss_id = business.buss_id inner join usertbl on business.buss_user_id = usertbl.user_id where invst_user_id = ? order by invst_id desc",
    user_id,
    (err, result) => {
      if (err) {
        res.send({ status: false, message: err.message });
      } else {
        db.query(
          "select * from withdraw inner join investment on withdraw.withdraw_invst_id = investment.invst_id where investment.invst_user_id = ? ",
          [user_id],
          (error, withdrawResutl) => {
            if (error) {
              console.log(error.message);
              res.send({ status: false, message: error.message });
            } else {
              res.send({ status: true, result, todayDate, withdrawResutl });
            }
          }
        );

        //Display the total return amount for investors
      }
    }
  );
});


app.post("/requestWithdraw", (req, res) => {

  const amountWithdraw = req.body.amountWithdraw;
  const emailPaypal = req.body.emailPaypal;
  const withdrawInvstID = req.body.withdrawInvstID;
  const formattedDate = req.body.createdAt;


  const status = "request";
  const insertintoWithdrawal =
    "insert into withdraw (withdraw_amt, withdraw_status, withdraw_invst_id,wihtdraw_email_add,withdraw_created_at) values(?,?,?,?,?)";

  db.query(
    insertintoWithdrawal,
    [amountWithdraw, status, withdrawInvstID, emailPaypal, formattedDate],
    (error, result) => {
      if (error) {
        console.log(error)
        return res.send({ status: false, message: error.message });
      } else {
        return res.send({ status: true });
      }
    }
  );
});



app.post("/ProfileViewFeeds", (req, res) => {
  const userType = "entrepreneur";
  const status = "approved";
  const id = req.body.user;

  db.query(
    "select business.*, usertbl.* ,businessapproved.*,  investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname , investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where usertbl.user_type = ? and business.buss_status = ? and business.buss_user_id = ? order by buss_id desc",
    [userType, status, id],
    (error, result) => {
      if (error) {
        return res.send({ success: false, error: error });
      } else {
        const businessWithInvestment = [];

        const resultsSet = result;

        resultsSet.forEach((row) => {
          let business = businessWithInvestment.find(
            (item) => item.buss_id === row.buss_id
          );

          if (!business) {
            business = {
              buss_id: row.buss_id,
              buss_name: row.buss_name,
              buss_type: row.buss_type,
              buss_type_name: row.buss_type_name,
              buss_address: row.buss_address,
              buss_photo: row.buss_photo,
              buss_station: row.buss_station,
              buss_station_name: row.buss_station_name,
              buss_experience: row.buss_experience,
              buss_prev_name: row.buss_prev_name,
              buss_summary: row.buss_summary,
              buss_target_audience: row.buss_target_audience,
              buss_useof_funds: row.buss_useof_funds,
              buss_capital: row.buss_capital,
              buss_approved_updated_year: row.buss_approved_updated_year,
              buss_approved_percent: row.buss_approved_percent,
              buss_created_at:row.buss_created_at,
              buss_status: row.buss_status,
              totalAmountInvts:row.totalAmountInvts,

              user_profile: row.user_profile,
              user_id: row.user_id,
              user_fname: row.user_fname,
              user_lname: row.user_lname,
              investments: [],
            };
            businessWithInvestment.push(business);
          }

          business.investments.push({
            investor_id: row.investor_id,
            investor_profile: row.investor_profile,
            investor_fname: row.investor_fname,
            investor_lname: row.investor_lname,
            invest_amount: row.invst_amt,
          });
        });

        return res.send({
          success: true,
          result: businessWithInvestment,
          filterData: businessWithInvestment,
        });
      }
    });
});


app.post("/EntrepViewFeeds", (req, res) => {
  const userType = "entrepreneur";
  const status = "approved";
  const id = req.body.user;

  db.query(
    "select business.*, usertbl.* ,businessapproved.*,  investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname , investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where usertbl.user_type = ? and business.buss_user_id = ? order by buss_id desc",
    [userType, id],
    (error, result) => {
      if (error) {
        return res.send({ success: false, error: error });
      } else {
        const businessWithInvestment = [];

        const resultsSet = result;

        resultsSet.forEach((row) => {
          let business = businessWithInvestment.find(
            (item) => item.buss_id === row.buss_id
          );

          if (!business) {
            business = {
              buss_id: row.buss_id,
              buss_name: row.buss_name,
              buss_type: row.buss_type,
              buss_type_name: row.buss_type_name,
              buss_address: row.buss_address,
              buss_photo: row.buss_photo,
              buss_station: row.buss_station,
              buss_station_name: row.buss_station_name,
              buss_experience: row.buss_experience,
              buss_prev_name: row.buss_prev_name,
              buss_summary: row.buss_summary,
              buss_target_audience: row.buss_target_audience,
              buss_useof_funds: row.buss_useof_funds,
              buss_capital: row.buss_capital,
              buss_approved_updated_year: row.buss_approved_updated_year,
              buss_approved_percent: row.buss_approved_percent,
              buss_created_at:row.buss_created_at,
              buss_status: row.buss_status,
              totalAmountInvts:row.totalAmountInvts,

              user_profile: row.user_profile,
              user_id: row.user_id,
              user_fname: row.user_fname,
              user_lname: row.user_lname,
              investments: [],
            };
            businessWithInvestment.push(business);
          }

          business.investments.push({
            investor_id: row.investor_id,
            investor_profile: row.investor_profile,
            investor_fname: row.investor_fname,
            investor_lname: row.investor_lname,
            invest_amount: row.invst_amt,
          });
        });

        return res.send({
          success: true,
          result: businessWithInvestment,
          filterData: businessWithInvestment,
        });
      }
    });
});


app.post("/ViewInvestors", (req, res) => {
  const userType = "entrepreneur";
  const status = "approved";
  const id = req.body.user;

  db.query(
    "select business.*, usertbl.* ,businessapproved.*,  investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname , investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where buss_status = ? and usertbl.user_type = ? and business.buss_user_id = ?",
    [status, userType, id],
    (error, result) => {
      if (error) {
        return res.send({ success: false, error: error });
      } else {
        const businessWithInvestment = [];

        const resultsSet = result;

        resultsSet.forEach((row) => {
          let business = businessWithInvestment.find(
            (item) => item.buss_id === row.buss_id
          );

          if (!business) {
            business = {
              buss_id: row.buss_id,
              buss_name: row.buss_name,
              buss_type: row.buss_type,
              buss_type_name: row.buss_type_name,
              buss_address: row.buss_address,
              buss_photo: row.buss_photo,
              buss_station: row.buss_station,
              buss_station_name: row.buss_station_name,
              buss_experience: row.buss_experience,
              buss_prev_name: row.buss_prev_name,
              buss_summary: row.buss_summary,
              buss_target_audience: row.buss_target_audience,
              buss_useof_funds: row.buss_useof_funds,
              buss_capital: row.buss_capital,
              buss_approved_updated_year: row.buss_approved_updated_year,
              buss_approved_percent: row.buss_approved_percent,
              buss_created_at:row.buss_created_at,
              buss_status: row.buss_status,
              totalAmountInvts:row.totalAmountInvts,

              user_profile: row.user_profile,
              user_id: row.user_id,
              user_fname: row.user_fname,
              user_lname: row.user_lname,
              investments: [],
            };
            businessWithInvestment.push(business);
          }

          business.investments.push({
            investor_id: row.investor_id,
            investor_profile: row.investor_profile,
            investor_fname: row.investor_fname,
            investor_lname: row.investor_lname,
            invest_amount: row.invst_amt,
            invest_returned_amount: row.invst_returned_amt,
            invst_created_at:row.invst_created_at

          });
        });

        return res.send({
          success: true,
          result: businessWithInvestment,
          filterData: businessWithInvestment,
        });
      }
    });
});

// app.post("/ProfileViewFeeds", (req, res) => {
//   const id = req.body.user;
//   const pass = req.body.pass;

//   db.query(
//         // "SELECT * FROM usertbl WHERE user_id = ?  ",
//         // "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where user_id = ?",
//      "select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts  from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_approved_buss_id  where buss_status = 'approved' and usertbl.user_type = 'entreprenuer' and business.buss_user_id = ? GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc",

//         [id],
//     (error, results) => {
//       if (error) {
//         console.log(error.errno);
//         return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
//       } 
//       else {

//         return res.send({ success: true, results})
       
    
//       }
//         }
//   );
// });





app.post("/investmentFinal", (req, res) => {
  const amount = req.body.amountToInvest;
  const totalReturn = req.body.totalReturn;
  const status = "request";
  const months = 12;
  const interest = 3;
  // const createdAt = req.body.createdAt;
  const user = req.body.user;
  const findBussinessID = req.body.findBussinessID;
  const transac_id = req.body.transac_id;
  const invst_interest_sum = req.body.invst_interest_sum;

  
  
  
    db.query(
      // "INSERT INTO investment (invst_amt, invst_returned_amt, invst_status, invst_num_month,  invst_interest, invst_created_at,  invst_user_id	, invst_buss_approved_buss_id ) VALUES (?,?,?,?,?,?,?,?)",
      // [amount, totalReturn, status, months, interest, createdAt,  user, findBussinessID  ],
      "INSERT INTO investment (invst_amt, invst_returned_amt, invst_interest_sum, invst_status, invst_num_month, invst_interest, invst_created_at,  invst_user_id, invst_transac_id, invst_buss_approved_buss_id ) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [amount, totalReturn, invst_interest_sum, status, months, interest, createdAt,  user, transac_id, findBussinessID  ],

      (error, results) => {
        if (error) {
          console.log(error);
          return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
      
        } 
        else {
          console.log("Investment")

          return res.send({ success: true, results})
         
      
        }
    }
  );
  
  });
  

  app.post("/notificationFinal", (req, res) => {
    const notifType =  "buss_invest"; //notif_type
    // const createdAt = req.body.createdAt; // notif_created_at
    const findBussinessUser = req.body.findBussinessUser; //user_id_reciever
    const status =  "unread"; //notif_status

    
  
    db.query(
       "INSERT INTO notification (notif_type, notif_created_at, user_id_reciever, notif_status ) VALUES (?,?,?,?)",
      [notifType, createdAt,findBussinessUser, status ],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
      
        } 
        else {
          console.log("Inserted")

          return res.send({ success: true, results})
         
      
        }
        }
    );
  });


  app.post("/NotifBusinessInvest", (req, res) => {
    const notifID = req.body.notifID; //notif_business_invest_id
    const notifMsg = req.body.notifMsg; //notif_content
    const findBussinessID = req.body.findBussinessID; //notif_business_table_id
    const invstID = req.body.invstID; //notif_business_investment_id
  
      db.query(
        "INSERT INTO notif_business_invest (notif_business_invest_id, notif_content, notif_business_table_id, notif_business_investment_id ) VALUES (?,?,?,?)",
        [notifID, notifMsg, findBussinessID, invstID ],
    (error, results) => {
      if (error) {
        console.log("fk error")

        console.log(error);
      } else {
        res.send(results);
        console.log("fk inserted")
      }
    }
    );
    
    });




  // app.post("/notifFinal", (req, res) => {
  //   const msg = req.body.notifMsg;
  //   const notifType =  "investment";
  //   const createdAt = req.body.createdAt;
  //   const user = req.body.user;
  //   const status =  "unread";
  //   const findBussinessUser = req.body.findBussinessUser;

    
  
  //   db.query(
  //       // "SELECT * FROM users WHERE email = ? AND pass = ?",
  //      "INSERT INTO notification (notif_content, notif_type, notif_created_at, user_id_reciever, notif_status ) VALUES (?,?,?,?,?)",
  //     [msg, notifType, createdAt,findBussinessUser, status ],
  //     (error, results) => {
  //       if (error) {
  //         console.log(error.errno);
  //         return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
      
  //       } 
  //       else {
  //         console.log("Inserted")

  //         return res.send({ success: true, results})
         
      
  //       }
  //       }
  //   );
  // });
  
    

//newest 
  

app.post("/notificationsFinal", (req, res) => {
    const msg = req.body.notifMsg;
    const notifType =  "investment";
    // const createdAt = req.body.createdAt;
    const user = req.body.user;
    const status =  "unread";
    const findBussinessUser = req.body.findBussinessUser;
    const referenceID = req.body.bussinessID;
  
    
  
    db.query(
       "INSERT INTO notification (notif_content, notif_type, notif_created_at, user_id_reciever, notif_status, notif_reference_id ) VALUES (?,?,?,?,?,?)",
      [msg, notifType, createdAt,findBussinessUser, status,referenceID ],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
      
        } 
        else {
          console.log("Inserted")
  
          return res.send({ success: true, results})
         
      
        }
        }
    );
  });
  
  






  // app.post("/NotficationTypeInvest", (req, res) => {
  //   const notifID = req.body.notifID;
  //   const invstID = req.body.invstID;
  
  //     db.query(
  //       "INSERT INTO notif_type_invest (notif_type_id_invest, notif_type_investment_id) VALUES (?,?)",
  //       [notifID, invstID ],
  //   (error, results) => {
  //     if (error) {
  //       console.log("fk error")

  //       console.log(error);
  //     } else {
  //       res.send(results);
  //       console.log("fk inserted")
  //     }
  //   }
  //   );
    
  //   });



    // app.post("/getNotifDisplayFinal", (req, res) => {
    //   const user = req.body.user;
    
    //   db.query(
    //     "select notification.*, usertbl.user_id as investorID,  usertbl.user_fname as investors_fname, usertbl.user_lname as investors_lname, usertbl.user_profile as investorProfile, business.buss_id as businessID from notification inner join business on business.buss_id = notification.notif_reference_id inner join businessapproved on business.buss_id  = businessapproved.buss_approved_buss_id inner join investment on investment.invst_buss_approved_buss_id = businessapproved.buss_approved_buss_id inner join usertbl on investment.invst_user_id = usertbl.user_id where  notification.notif_type = 'investment' and notification.user_id_reciever = ? group by notif_id order by notif_id desc",
    //     // "select * from notification inner join notif_type_invest on notification.notif_id = notif_type_invest.notif_type_id_invest inner join investment on notif_type_invest.notif_type_investment_id = investment.invst_id inner join usertbl on investment.invst_user_id = usertbl.user_id where user_id_reciever =?",    
    //     [user],
    //     (error, results) => {
    //       if (error) {
    //         console.log(error);
    //       } else {
    //         res.send(results);
    //       }
    //     }
    //   );
    
    // });
    
    
  

    app.post("/FilterSearch", (req, res) => {
      const useSearch = req.body.useSearch;
    
      db.query(
      "select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_id where buss_status = 'Pending' and usertbl.user_type = 'entrepreneur' and  buss_type_name LIKE 'Baking' GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc ",        
      [useSearch],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
        
          } 
          else {
    
            return res.send({ success: true, results})
           
        
          }
            }
      );
    });

    app.get('/search', (req, res) => {
      const query = req.query.useSearch; // Extract the 'query' parameter from the URL
    
      if (!query) {
        return res.json([]);
      }
    
      // const sql = `SELECT * FROM your_table WHERE column_name LIKE '%${query}%'`;
    //  const sql = `select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_id where buss_status = "Pending" and usertbl.user_type = "entreprenuer" and  buss_type_name LIKE '%${query}%' GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc `;       
     const sql = `select business.*, usertbl.* ,businessapproved.*, sum(investment.invst_amt) as totalAmountInvts, investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname , investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id where buss_status = 'approved' and usertbl.user_type = 'entrepreneur' and  buss_type_name LIKE '%${query}%'`;
    
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Database query error: ' + err.message);
          return res.status(500).json({ error: 'Database error' });
        }
    
        res.json(results);
      });
    });
    
    

    app.post("/getNotifCount", (req, res) => {
      const user = req.body.user;
      db.query(
      "SELECT count(notif_status) as status from notification WHERE notif_status = 'unread' AND user_id_reciever =?",[user],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
        
          } 
          else {
    
            return res.send({ success: true, results})
           
        
          }
            }
      );
    });
    

    app.post("/NotifStatusRead", (req, res) => {
      const notifStatusID = req.body.notifID;
      const statusRead = "read";
      db.query(
         "UPDATE notification SET notif_status = ? WHERE notif_id = ? ",
        [ statusRead, notifStatusID],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Updated")
            res.send(results);
          }
        }
      );
    });





    app.post("/updateProfileFinal", (req, res) => {
      const user = req.body.user;
      const {
        userType,
        firstName,
        lastName,
        middleName,
        bDate,
        selectedgender,
        userage,
        contactNum,
        email,
        pass,
        selectedProvince,
        selectedCity,
        selectedBrgy,
        imageURL,
        createdAt,
      } = req.body;

      // const bDate = req.body.bDate;
      // const parsedDate = new Date(bDate);
      // const formattedDate = parsedDate.toISOString().split('T')[0];

      let formattedDate = null;

        try {
          const parsedDate = new Date(bDate);
          if (!isNaN(parsedDate)) {
            formattedDate = parsedDate.toISOString().split('T')[0];
          } else {
            // Handle invalid date
            console.error('Invalid date format or value');
          }
        } catch (error) {
          // Handle any other errors that might occur during date conversion
          console.error('Error while parsing date:', error);
        }
    
    
      // Retrieve existing data for the user from the database
      db.query(
        "SELECT * FROM usertbl WHERE user_id = ?",
        [user],
        (selectError, selectResults) => {
          if (selectError) {
            console.log(selectError);
            console.log("failed to retrieve existing data");
            return res.send({ success: false, failed: selectError.sqlMessage, errorNum: selectError.errno });
          }
    
          if (selectResults.length === 0) {
            return res.send({ success: false, message: "User not found." });
          }
    
          const existingData = selectResults[0];
    
          // Merge the existing data with the new data, but prioritize new data if it exists
          const updatedData = {
            user_type: userType || existingData.user_type,
            user_fname: firstName || existingData.user_fname,
            user_lname: lastName || existingData.user_lname,
            user_mname: middleName || existingData.user_mname,
            user_bdate: formattedDate || existingData.user_bdate,
            user_gender: selectedgender || existingData.user_gender,
            user_age: userage || existingData.user_age,
            user_contact_num: contactNum || existingData.user_contact_num,
            user_email: email || existingData.user_email,
            user_password: pass || existingData.user_password,
            user_province: selectedProvince || existingData.user_province,
            user_city: selectedCity || existingData.user_city,
            user_barangay: selectedBrgy || existingData.user_barangay,
            user_profile: imageURL || existingData.user_profile,
            user_updated_at: createdAt || new Date(),
          };
    
          // Update the database with the merged data
          db.query(
            "UPDATE usertbl SET user_type = ?, user_fname = ?, user_lname = ?, user_mname = ?, user_bdate = ?, user_gender = ?, user_age = ?, user_contact_num = ?, user_email = ?, user_password = ?, user_province = ?, user_city = ?, user_barangay = ?, user_profile = ?, user_updated_at = ? WHERE user_id = ?",
            [
              updatedData.user_type,
              updatedData.user_fname,
              updatedData.user_lname,
              updatedData.user_mname,
              updatedData.user_bdate,
              updatedData.user_gender,
              updatedData.user_age,
              updatedData.user_contact_num,
              updatedData.user_email,
              updatedData.user_password,
              updatedData.user_province,
              updatedData.user_city,
              updatedData.user_barangay,
              updatedData.user_profile,
              updatedData.user_updated_at,
              user,
            ],
            (updateError, updateResults) => {
              if (updateError) {
                console.log(updateError.errno);
                console.log("failed");
                console.log(updateError)
                return res.send({ success: false, failed: updateError.sqlMessage, errorNum: updateError.errno });
              } else {
                console.log("success");
                return res.send({ success: true, results: updateResults });
              }
            }
          );
        }
      );
    });
        

// not tested yet
    app.post("/updateBusiness", (req, res) => {
      const user = req.body.user;
      const {
        businessName,
        businessTypeSelectd,
        bussNameSelectd,
        selectedProvince,
        selectedCity,
        selectedBrgy,
        bussStationYN,
        bussLocationAdd,
        bussExperienceYN,
        businesstExp,
        bussSummary,
        bussAudience,
        bussFunds,
        buss_support_doc,
        businessCapital,
        fileURL,
        loanreturn,
        installments,
        createdAt
      } = req.body;
    
      db.query(
        "SELECT * FROM business WHERE buss_user_id = ?",
        [user],
        (selectError, selectResults) => {
          if (selectError) {
            console.log(selectError);
            console.log("Failed to retrieve existing data");
            return res.send({ success: false, failed: selectError.sqlMessage, errorNum: selectError.errno });
          }
    
          if (selectResults.length === 0) {
            return res.send({ success: false, message: "User not found." });
          }
    
          const existingData = selectResults[0];
    
          const updatedData = {
            buss_name: businessName || existingData.buss_name,
            buss_type: businessTypeSelectd || existingData.buss_type,
            buss_type_name: bussNameSelectd || existingData.buss_type_name,
            buss_address: `${selectedProvince}, ${selectedCity}, ${selectedBrgy}` || existingData.buss_address,
            buss_photo: fileURL || existingData.buss_photo,
            buss_station: bussStationYN || existingData.buss_station,
            buss_station_name: bussLocationAdd || existingData.buss_station_name,
            buss_experience: bussExperienceYN || existingData.buss_experience,
            buss_prev_name: businesstExp || existingData.buss_prev_name,
            buss_summary: bussSummary || existingData.buss_summary,
            buss_target_audience: bussAudience || existingData.buss_target_audience,
            buss_useof_funds: bussFunds || existingData.buss_useof_funds,
            buss_support_doc: buss_support_doc || existingData.buss_support_doc,
            buss_capital: businessCapital || existingData.buss_capital,
            buss_no_of_months: loanreturn || existingData.buss_no_of_months,
            buss_installment: installments || existingData.buss_installment,
            buss_status: "pending", // Assuming this value is provided from somewhere
            buss_updated_at: createdAt || new Date(),
          };
    
          db.query(
            `UPDATE business
            SET buss_name = ?, buss_type = ?, buss_type_name = ?, buss_address = ?, buss_photo = ?, buss_station = ?,
                buss_station_name = ?, buss_experience = ?, buss_prev_name = ?, buss_summary = ?, buss_target_audience = ?,
                buss_useof_funds = ?, buss_support_doc = ?, buss_capital = ?, buss_no_of_months = ?, buss_installment = ?,
                buss_status = ?, buss_updated_at = ?
            WHERE buss_user_id = ?`,
            [
              updatedData.buss_name,
              updatedData.buss_type,
              updatedData.buss_type_name,
              updatedData.buss_address,
              updatedData.buss_photo,
              updatedData.buss_station,
              updatedData.buss_station_name,
              updatedData.buss_experience,
              updatedData.buss_prev_name,
              updatedData.buss_summary,
              updatedData.buss_target_audience,
              updatedData.buss_useof_funds,
              updatedData.buss_support_doc,
              updatedData.buss_capital,
              updatedData.buss_no_of_months,
              updatedData.buss_installment,
              updatedData.buss_status,
              updatedData.buss_updated_at,
              user,
            ],
            (updateError, updateResults) => {
              if (updateError) {
                console.log(updateError.errno);
                console.log("Failed to update");
                console.log(updateError);
                return res.send({ success: false, failed: updateError.sqlMessage, errorNum: updateError.errno });
              } else {
                console.log("Success");
                return res.send({ success: true, results: updateResults });
              }
            }
          );
        }
      );
    });
    



    // app.post("/ViewBussiness", (req, res) => {
    //   const id = req.body.bussID;
    
    //   db.query(
    //       " select business.*, usertbl.* ,businessapproved.*,  sum(investment.invst_amt) as totalAmountInvts, investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id where buss_status = 'approved' and usertbl.user_type = 'entreprenuer' and business.buss_id = ?",
    //     [id],
    //     (error, results) => {
    //       if (error) {
    //         console.log(error.errno);
    //         return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
        
    //       } 
    //       else {
    
    //         return res.send({ success: true, results})
           
        
    //       }
    //         }
    //   );
    // });

        app.post("/ViewInvest", (req, res) => {
      const id = req.body.bussID;
    
      db.query(
          " select business.*, usertbl.* ,businessapproved.*,  sum(investment.invst_amt) as totalAmountInvts, investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id where buss_status = 'approved' and usertbl.user_type = 'entrepreneur' and business.buss_id = ?",
        [id],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
        
          } 
          else {
            if (results.length > 0) {
              results = results.map((item) => ({
                ...item,
                remainingAmount: item.buss_capital - item.totalAmountInvts
              }));
            }
    
            return res.send({ success: true, results})
           
        
          }
            }
      );
    });



        app.post("/ViewBussinessReturn", (req, res) => {
      const id = req.body.bussID;
    
      db.query(
          "select * from business where buss_id = ?",
        [id],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
        
          } 
          else {
    
            return res.send({ success: true, results})
           
        
          }
            }
      );
    });

//for return
app.post("/viewBusinessInstallments", (req, res) => {
  const buss_id = req.body.buss_id;
  const user_id = req.body.user_id;
  //const currentDate = new Date();
  //const day = new Date(new Date().setDate);
  // const currentDate = new Date();

  // const formattedDate = currentDate
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");
  const getReturnLoanData =
    "select * from returnloan where returnLoan_buss_id = ? order by returnLoan_transac_id desc";

  db.query(
    "select * from transactions inner join returnloan on transactions.transac_id = returnloan.returnLoan_transac_id where returnloan.returnLoan_buss_id  = ? order by transac_id desc",
    buss_id,
    (error, transresult) => {
      if (error) {
        return res.send({ status: false, message: error.message });
      } else {
        db.query(
          "select buss_installment from business where buss_id = ?",
          buss_id,
          (error, result) => {
            if (error) {
              console.log(error);
              return res.send({ status: false, message: error.message });
            } else {
              db.query(
                getReturnLoanData,
                buss_id,
                (error, retunrLoanResult) => {
                  if (error) {
                    console.log(error);
                    return res.send({ status: false, message: error.message });
                  } else {
                    const returnData = retunrLoanResult;
                    const installmentsData = JSON.parse(
                      result[0].buss_installment
                    );

                    //Function for calulating the total Reypayment
                    const totalReyPayment = installmentsData.reduce(
                      (sum, item) => sum + item.installment,
                      0
                    );

                    //Function for calculating the total paid amount
                    const totalPaidAmount = returnData.reduce(
                      (sum, item) => sum + item.returnLoan_amt,
                      0
                    );

                    //Computation for the remaining amount
                    const remainingPaymentsAmount =
                      totalReyPayment - totalPaidAmount;

                    //get the paid id
                    const paidId = returnData.map((item) => item.returnLoan_id);

                    const missedPaymentsData = installmentsData.filter(
                      (installment) => {
                        return (
                          currentDate >= new Date(installment.maxdate) &&
                          !paidId.includes(installment.id)
                        );
                      }
                    );

                    const remainingPayment = installmentsData.filter((item) => {
                      if (!paidId.includes(item.id)) {
                        return item;
                      }
                    });

                    const returnDataIDs = returnData.map((item) => ({
                      returnLoan_id: item.returnLoan_id,
                      returnLoan_amt: item.returnLoan_amt,
                    }));

                    const missedPaymentId = missedPaymentsData.map(
                      (item) => item.id
                    );

                    const installmentsDatas = installmentsData.map((item) => {
                      if (missedPaymentId.includes(item.id)) {
                        return { ...item, status: "missed" };
                      } else {
                        const matchingReturnData = returnDataIDs.find(
                          (returnItem) => returnItem.returnLoan_id === item.id
                        );

                        if (matchingReturnData) {
                          return {
                            ...item,
                            status: "paid",
                            amount: matchingReturnData.returnLoan_amt,
                          };
                        } else {
                          return { ...item, status: "not paid" };
                        }
                      }
                    });

                    console.log(new Date(currentDate).toDateString());
                    const todayPayment = installmentsDatas.find((item) => {
                      if (
                        currentDate >= new Date(item.mindate) &&
                        currentDate <= new Date(item.maxdate)
                      ) {
                        return item;
                      }
                    });

                    const handleComputeAddedInterest = (maxdate, amount) => {
                      const timeDifference =
                        new Date(currentDate) - new Date(maxdate);
                      const daysDifference = Math.floor(
                        timeDifference / (1000 * 60 * 60 * 24)
                      );
                      const interest = amount * 0.01;
                      const interestAdded = interest * parseInt(daysDifference);
                      const totalPayment = interestAdded + amount;
                      return totalPayment;
                    };

                    const missedPayments = installmentsDatas
                      .filter((item) => item.status === "missed")
                      .map((item) => ({
                        data: item,
                        totalPayment: handleComputeAddedInterest(
                          item.maxdate,
                          item.installment
                        ),
                      }));

                

                    return res.send({
                      status: true,
                      totalReyPayment: totalReyPayment,
                      totalPaidAmount: totalPaidAmount,
                      remainingPaymentsAmount,
                      currentDate,
                      remainingPayment,
                      todayPayment,
                      installmentsDatas,
                      missedPayments,
                      returnData,
                      transresult,
                      getReturnLoanData,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

    

    app.post("/TransactionInvest", (req, res) => {
      const type = req.body.type; // transac_type
      const amount = req.body.amount; //transac_amt
      const email = req.body.email; //transac_email 
      const formattedDate = req.body.formattedDate; //transac_created_at
      const paypal_datalog = req.body.paypal_datalog; //transac_paypal_datalog
      const user = req.body.user; //transac_user_id


        db.query(
          "INSERT INTO transactions (transac_type, transac_amt, transac_email, transac_created_at, transac_paypal_datalog, transac_user_id ) VALUES (?,?,?,?,?,?)",
          [type, amount, email, formattedDate, paypal_datalog, user ],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
        } 
        else {
          console.log("Transaction Inserted")
    
          return res.send({ success: true, results})
         
      
        }
          }
      );
      
      });
  
  
    
        
      // app.post("/ReturnLoan", (req, res) => {
      //   const installmentID = req.body.installmentID;
      //   const amount = req.body.installment;
      //   // const createdAt = req.body.createdAt;
      //   const transac_id = req.body.transac_id;
      //   const buss_id = req.body.buss_id;
      //   const installmentLength = req.body.instllmentLENGTH;
        
      //   const checkReturLoanLength =
      //   "select * from returnloan where returnLoan_buss_id = ? ";
    
      //     db.query(
      //       "INSERT INTO returnloan (returnLoan_id, returnLoan_amt, returnLoan_created_at, returnLoan_transac_id, returnLoan_buss_id) VALUES (?,?,?,?,?)",
      //       [installmentID, amount, createdAt, transac_id, buss_id ],
      //       (error, results) => {
      //         if (error) {
      //           console.log(error);
      //           return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
            
      //         } 
      //         else {
      //           console.log("Return Loan")
      //           db.query(
      //             checkReturLoanLength,
      //             buss_id,
      //             (error, results) => {
      //               if(error){
      //                 console.log(error);
      //                 return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
      //               }
      //               else{
      //                 if(results.length === installmentLength){
      //                   console.log("Return Loan Length equal " + results.length);
      //                   const status = "complete";

      //                   db.query(
      //                     "UPDATE business SET buss_status = ? WHERE buss_id = ?",
      //                     [status, buss_id],
      //                     (error, results) => {
      //                       if(error){
      //                         return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
      //                       }
      //                       else{
      //                         console.log("Successfully Paid and the business loan is completed.")
      //                         return res.send({ success: true, results})


      //                       }
      //                     }
      //                   )
      //                 }
      //                 else{
      //                   console.log("Return Length is not equal."+ results.length)
      //                   return res.send({ success: true, results})


      //                 }

      //               }
      //             }

      //           )
      //           // return res.send({ success: true, results})
               
            
      //         }
      //     }
      //   );
        
      //   });


      app.post("/ReturnLoan", (req, res) => {
        const installmentID = req.body.installmentID;
        const amount = req.body.installment;
        const createdAt = req.body.createdAt;
        const transac_id = req.body.transac_id;
        const buss_id = req.body.buss_id;
        const installmentLength = req.body.instllmentLENGTH;
        // const email = req.body.email;
        // const data = req.body.data;
    
        const checkReturLoanLength =
        "select * from returnloan where returnLoan_buss_id = ? ";
    
          db.query(
            "INSERT INTO returnloan (returnLoan_id, returnLoan_amt, returnLoan_created_at, returnLoan_transac_id, returnLoan_buss_id) VALUES (?,?,?,?,?)",
            [installmentID, amount, createdAt, transac_id, buss_id ],
            (error, results) => {
              if (error) {
                console.log(error);
                return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
            
              } 
              else {
                // console.log("Return Loan")
                db.query(
                  checkReturLoanLength,
                  buss_id,
                  (error, results) => {
                    if(error){
                      console.log(error);
                      return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
                    }
                    else{
                      if(results.length === installmentLength){
                        console.log("Return Loan Length equal " + results.length);
                        const status = "complete";
    
                        db.query(
                          "UPDATE business SET buss_status = ? WHERE buss_id = ?",
                          [status, buss_id],
                          (error, results) => {
                            if(error){
                              return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
                            }
                            else{
    
                                db.query(
                                    "select sum(invst_returned_amt) as totalInvesmentReturn from investment where invst_buss_approved_buss_id = ?",
                                    buss_id,
                                    (error, resultTotalInvestmentAmount) => {
                                      if (error) {
                                        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
                                      } else {
                                        db.query(
                                          "select sum(returnLoan_amt) as toatalReturn from returnloan where returnLoan_buss_id = ?",
                                          buss_id,
                                          (error, resultBusinessLoanReturn) => {
                                            if (error) {
                                                return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
                                            } else {
                                              const totaInvestAMount =
                                                resultTotalInvestmentAmount[0]
                                                  .totalInvesmentReturn;
                                              const totalLoanReturn =
                                                resultBusinessLoanReturn[0]
                                                  .toatalReturn;
      
                                              const totalEarnings =
                                                parseFloat(totalLoanReturn) -
                                                parseFloat(totaInvestAMount);
      
                                              db.query(
                                                "insert into earnings (earnings_amt, earnings_created_at,earnings_buss_id ) values(?,?,?)",
                                                [
                                                  totalEarnings,
                                                  createdAt,
                                                  buss_id,
                                                ],
                                                (error, results) => {
                                                  if (error) {
                                                    return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
                                                  } else {
                                                    console.log("Successfully Paid and the business loan is completed.")
                                                    return res.send({ success: true, results})
                                                                    }
                                                }
                                              );
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
    
    
    
    
    
    
    
    
    
                            //   console.log("Successfully Paid and the business loan is completed.")
                            //   return res.send({ success: true, results})
    
    
                            }
                          }
                        )
                      }
                      else{
                        console.log("Return Length is not equal."+ results.length)
                        return res.send({ success: true, results})
    
    
                      }
    
                    }
                  }
    
                )
                // return res.send({ success: true, results})
               
            
              }
          }
        );
        
        });
    
      
      app.post("/payretunrloan", (req, res) => {
        // const {
        //   amount,
        //   email,
        //   paypalDatalog,
        //   user_id,
        //   installmentId,
        //   buss_id,
        //   installmentLength,
        // } = req.body;

          const installmentId = req.body.installmentId;
        const amount = req.body.amount;
        const email = req.body.email;
        const paypalDatalog = req.body.paypalDatalog;
        const buss_id = req.body.buss_id;
        const user_id = req.body.user_id;

        const installmentLength = req.body.installmentLength;

        const type = "returnloan";
      
        const checkReturLoanLength =
          "select * from returnloan where returnLoan_buss_id = ? ";
        const transactionsSql =
          "insert into transactions (transac_type, transac_amt, transac_email, transac_created_at,transac_paypal_datalog, transac_user_id) values(?,?,?,?,?,?)";
      
        const retunrLoanSql =
          "insert into returnloan (returnLoan_id, returnLoan_amt, returnLoan_created_at, returnLoan_transac_id, returnLoan_buss_id ) values(?,?,?,?,?)";
      
        db.query(
          transactionsSql,
          [type, amount, email, currentDate, paypalDatalog, user_id],
          (error, result) => {
            if (error) {
              return res.send({ status: false, message: error.message });
            } else {
              const trans_id = result.insertId;
      
              db.query(
                retunrLoanSql,
                [installmentId, amount, currentDate, trans_id, buss_id],
                (error, result) => {
                  if (error) {
                    return res.send({ status: false, message: error.message });
                  } else {
                    db.query(
                      checkReturLoanLength,
                      buss_id,
                      (error, returnLoanLenght) => {
                        if (error) {
                          return res.send({ status: false, message: error.message });
                        } else {
                          if (returnLoanLenght.length === installmentLength) {
                            console.log(
                              "Return Loan Length equal " + returnLoanLenght.length
                            );
                            const status = "complete";
                            db.query(
                              "update business set buss_status = ? where buss_id = ?",
                              [status, buss_id],
                              (error, result) => {
                                if (error) {
                                  return res.send({
                                    status: false,
                                    message: error.message,
                                  });
                                } else {

                                  db.query(
                                    "select sum(invst_returned_amt) as totalInvesmentReturn from investment where invst_buss_approved_buss_id = ?",
                                    buss_id,
                                    (error, resultTotalInvestmentAmount) => {
                                      if (error) {
                                        return res.send({
                                          status: false,
                                          message: error.message,
                                        });
                                      } else {
                                        db.query(
                                          "select sum(returnLoan_amt) as toatalReturn from returnloan where returnLoan_buss_id = ?",
                                          buss_id,
                                          (error, resultBusinessLoanReturn) => {
                                            if (error) {
                                              return res.send({
                                                status: false,
                                                message: error.message,
                                              });
                                            } else {
                                              const totaInvestAMount =
                                                resultTotalInvestmentAmount[0]
                                                  .totalInvesmentReturn;
                                              const totalLoanReturn =
                                                resultBusinessLoanReturn[0]
                                                  .toatalReturn;
      
                                              const totalEarnings =
                                                parseFloat(totalLoanReturn) -
                                                parseFloat(totaInvestAMount);
      
                                              db.query(
                                                "insert into earnings (earnings_amt, earnings_created_at,earnings_buss_id ) values(?,?,?)",
                                                [
                                                  totalEarnings,
                                                  formattedDate,
                                                  buss_id,
                                                ],
                                                (error, result) => {
                                                  if (error) {
                                                    return res.send({
                                                      status: false,
                                                      message: error.message,
                                                    });
                                                  } else {
                                                    return res.send({
                                                      status: true,
                                                      message:
                                                        "Successfully Paid and the business loan is completed.",
                                                    });
                                                  }
                                                }
                                              );
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );


                                }
                              }
                            );
                          } else {
                            console.log(
                              "Return Loan Length Not equal " +
                                returnLoanLenght.length
                            );
                            return res.send({
                              status: true,
                              message: "Successfully Paid",
                            });
                          }
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      });
      
        app.post("/getNotification", (req, res) => {
          const user_id = req.body.user_id;
          const status = "unread";
          const notif_type = req.body.notif_type;
          const type = "buss_update";
          if (notif_type === "business") {
            db.query(
              "select notification.*, usertbl.user_id as investorID, notif_content,usertbl.user_profile as investorProfile, business.buss_id as businessID , usertbl.user_fname as firstname, usertbl.user_lname as lastname from notification inner join notif_business_invest on notification.notif_id = notif_business_invest.notif_business_invest_id inner join business on notif_business_invest.notif_business_table_id = business.buss_id inner join investment on notif_business_invest.notif_business_investment_id =  investment.invst_id inner join usertbl on investment.invst_user_id = usertbl.user_id  WHERE  (notification.notif_type = 'buss_invest' AND notification.notif_status = 'unread' AND notification.user_id_reciever = ?) OR (notification.notif_type = 'buss_invest' AND notification.notif_status = 'read' AND notification.user_id_reciever = ?) GROUP BY notif_id ",
              [user_id, user_id],
              (error, result) => {
                if (error) {
                  return res.send({ status: false, message: error.message });
                } else {
                  db.query(
                    "select notification.*, business.buss_photo, notif_content, buss_name from notification inner join notif_business_update on notification.notif_id = notif_business_update.notif_business_update_id inner join business on notif_business_update.notif_business_table_id = business.buss_id where notification.user_id_reciever = ? and notif_status = ? and notif_type = ?",
                    [user_id, status, type],
                    (error, buss_update_result) => {
                      const arrayData = result.concat(buss_update_result);
        
                      return res.send({ status: true, result: arrayData });
                      
                    }
                  );
                }
              }
            );
          } else if (notif_type === "investment") {
            db.query(
              "select notification.*, notif_content, buss_photo, buss_name  from notification inner join notif_investment on notification.notif_id = notif_investment.notif_investment_id inner join investment on notif_investment.notif_investment_table_id = investment.invst_id inner join businessapproved on investment.invst_buss_approved_buss_id = businessapproved.buss_approved_buss_id inner join business on businessapproved.buss_approved_buss_id = business.buss_id where notif_type = 'investment' and notif_status =? and user_id_reciever = ?",
              [status, user_id],
              (error, result) => {
                if (error) {
                  return res.send({ status: false, message: error.message });
                } else {
                  return res.send({ status: true, result });
                }
              }
            );
          }
        });
        
        // for online server
        app.post("/loginPage", (req, res) => {
          const email = req.body.email;
          const pass = req.body.pass;
        
          db.query(
            "select * from usertbl where user_email = ?",
            email,
            (error, results) => {
              if (error) {
                return res.send({ sucess: false, message: error.message });
              }
        
              if (results.length > 0) {
                console.log(results.length)
                bcrypt.compare(pass, results[0].user_password, (err, response) => {
                  if (response) {
                    return res.send({ success: true, results: results });
                  } else {
                    return res.send({ success: false, message: "Wrong password" });
                  }
                });
              } else {
                return res.send({ success: false, message: "Wrong username" });
              }
            }
          );
        });
        // app.post("/loginPage", (req, res) => {
        //   const email = req.body.email;
        //   const pass = req.body.pass;
        
        //   db.query(
        //         // "SELECT * FROM usertbl WHERE user_email = ? AND user_password = ? ",
        //         "SELECT * FROM usertbl WHERE user_email = ? ",
        
        //     email,
        //     (error, results) => {
        //       if (error) {
                
        //         return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
            
        //       } 
        //       else {
                
        //         if(results.length>0){
                
        //           bcrypt.compare(pass, results[0].user_password, (error, response) =>{
        
        //             if(response){
        //               return res.send({succes: true, results})
        //             }
        //             else {
        //               return res.send({ success: false, })
        
        //             }
        //           })
        //         return res.send({ success: true, results})
        
        //         }
        //         else{
        //         return res.send({ success: false})
                  
        //         }
            
        //       }
        //         }
        //   );
        // });

      
        app.post("/getInvestHasInvestments", (req, res) => {
          const buss_id = req.body.buss_id;
          const user_id = req.body.user_id;
          db.query(
            "select * from investment where invst_user_id = ? and invst_buss_approved_buss_id = ?",
            [user_id, buss_id],
            (error, result) => {
              if (error) {
                return res.send({ status: false, message: error.message });
              } else {
                if (result.length > 0) {
                  return res.send({ status: true, hasInvesment: true });
                } else {
                  return res.send({
                    status: true,
        
                    hasInvesment: false,
                  });
                }
              }
            }
          );
        });


        app.post("/BussReciept", (req, res) => {
          const bussReciept = req.body.bussReciept;
          const recieptID = req.body.recieptID;
          const status = "pending"
        
          db.query(
             "UPDATE businessfunds SET bussFunds_reciept = ?, bussFunds_reciept_status = ?  WHERE bussFunds_id = ? ",
            [ bussReciept, status, recieptID],
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Updated")
                res.send(results);
              }
            }
          );
        });

        app.post("/BussFundsAmountRecieve", (req, res) => {
          const bussReciept = req.body.fundsID;
          const amountStatus = "recieve";
        
          db.query(
             "UPDATE businessfunds SET bussFunds_amount_recieve_status = ? WHERE bussFunds_id = ? ",
            [amountStatus, bussReciept],
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Updated")
                res.send(results);
              }
            }
          );
        });
        
        app.post("/BussFundsAmountDecline", (req, res) => {
          const bussReciept = req.body.fundsID;
          const amountStatus = "not recieve";
        
          db.query(
             "UPDATE businessfunds SET bussFunds_amount_recieve_status = ? WHERE bussFunds_id = ? ",
            [amountStatus, bussReciept],
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Updated")
                res.send(results);
              }
            }
          );
        });
        



        app.post("/BussFunds", (req, res) => {
          const recieptID = req.body.recieptID;
          db.query(
             "SELECT * FROM businessfunds WHERE bussFunds_id = ? ",

            [recieptID],
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Updated")
                res.send(results);
              }
            }
          );
        });




// // Endpoint to fetch business data by ID
// app.post("/ViewBusinessAndFunds", (req, res) => {
//   const bussID = req.body.bussID;

//   // Fetch business data based on the provided ID
//   db.query(
//     "SELECT * FROM business WHERE buss_id = ?",
//     [bussID],
//     (error, businessResult) => {
//       if (error) {
//         return res.send({ success: false, error: error });
//       } else {
//         // Once you have the business data, fetch related funds using the business ID
//         db.query(
//           "SELECT * FROM businessfunds WHERE bussFunds_buss_id = ?",
//           [bussID],
//           (fundError, fundResult) => {
//             if (fundError) {
//               return res.send({ success: false, error: fundError });
//             } else {
//               const businessWithFunds = {
//                 business: businessResult[0], // Assuming you only expect one business record
//                 funds: fundResult, // Array of related funds
//               };

//               return res.send({
//                 success: true,
//                 result: businessWithFunds,
//               });
//             }
//           }
//         );
//       }
//     }
//   );
// });




app.post("/ViewBusinessAndFunds", (req, res) => {
  const bussID = req.body.bussID;

  db.query(
    "select * from business left join businessfunds on business.buss_id = businessfunds.bussFunds_buss_id where business.buss_id  = ?",
    bussID,
    (error, result) => {
      if (error) {
        return res.send(error);
      } else {
        const list = [];
        result.forEach((row) => {
          let business = list.find((item) => item.buss_id === row.buss_id);

          if (!business) {
            business = {
              buss_id: row.buss_id,
              buss_name: row.buss_name,
              buss_type: row.buss_type,
              buss_type_name: row.buss_type_name,
              buss_address: row.buss_address,
              buss_photo: row.buss_photo,
              buss_station: row.buss_station,
              buss_station_name: row.buss_station_name,
              buss_experience: row.buss_experience,
              buss_prev_name: row.buss_prev_name,
              buss_summary: row.buss_summary,
              buss_target_audience: row.buss_target_audience,
              buss_useof_funds: row.buss_useof_funds,
              buss_capital: row.buss_capital,
              buss_approved_updated_month: row.buss_approved_updated_month,
              buss_approved_percent: row.buss_approved_percent,
              buss_installment: row.buss_installment,
              buss_capital: row.buss_capital,
              buss_no_of_months: row.buss_no_of_months,
              buss_interest: row.buss_interest,
              buss_loan_return: row.buss_loan_return,

              businessFunds: [],
            };
            list.push(business);
          }

          business.businessFunds.push({
            bussFunds_id: row.bussFunds_id,
            bussFunds_product: row.bussFunds_product,
            bussFunds_amount: row.bussFunds_amount,
            bussFunds_reciept: row.bussFunds_reciept,
            bussFunds_paypal_batch_id: row.bussFunds_paypal_batch_id,
            bussFunds_amount_recieve_status:
              row.bussFunds_amount_recieve_status,
            bussFunds_reciept_status: row.bussFunds_reciept_status,
          });
        });

        return res.send(list);
      }
    }
  );
});




app.post("/getchtmsg", (req, res) => {
  const adminId = req.body.adminId;
  const user = req.body.user_id;



  const checkChatRoomSql =
    "select chtroom_id from chatroom where cht_admin_id = ? and cht_user_id = ? ";
  db.query(checkChatRoomSql, [adminId, user], (error, results) => {
    if (error) {
      return res.send({ status: false, message: error.message });
    } else {
      if (results.length > 0) {
        const chatroom_id = results[0].chtroom_id;
        db.query(
          "select * from chatmsg where chtmsg_chtroom_id = ?",
          chatroom_id,
          (error, result) => {
            if (error) {
              return res.send({ status: false, message: error.message });
            } else {
              // console.log(result)
              return res.send({ status: true, result });
            }
          }
        );
      }
    }
  });
});



app.post("/chatRoom", (req, res) => {
  const { adminId, user, content, senderId } = req.body;


  const insertIntoChatroom =
    "insert into chatroom (cht_admin_id, cht_user_id) values(?,?)";
  const insertIntoChtmsg =
    "insert into chatmsg (chtmsg_content, chtmsg_sender_id,chtmsg_chtroom_id, chtmsg_created_at) values(?,?,?,?)";
  const checkChatRoomSql =
    "select chtroom_id from chatroom where cht_admin_id = ? and cht_user_id = ? ";

  db.query(checkChatRoomSql, [adminId, user], (error, result) => {
    if (error) {
      return res.send({ status: false });
    } else {
      if (result.length > 0) {
        const chtRoomID = result[0].chtroom_id;
        console.log(chtRoomID);
        db.query(
          insertIntoChtmsg,
          [content, senderId, chtRoomID, createdAt],
          (error, result) => {
            if (error) {
              return res.send({ status: false, message: error.message });
            } else {
              return res.send({ status: true });
            }
          }
        );
      } else {
        db.query(insertIntoChatroom, [adminId, user], (error, results) => {
          if (error) {
            return res.send({ status: false, message: error.message });
          } else {
            const chatroomID = results.insertId;
            console.log("Server")
            db.query(
              insertIntoChtmsg,
              [content, senderId, chatroomID, createdAt],
              (error, result) => {
                if (error) {
                  return res.send({ status: false, message: error.message });
                } else {
                  return res.send({ status: true });
                }
              }
            );
          }
        });
      }
    }
  });
});



app.post("/IDimage", (req, res) => {
  const { imageP, selectedID, imageFrontID, imageBackID, user, createdAt } = req.body;
  const status = "pending";

  db.query(
    `INSERT INTO user_identity 
    (user_identity_user_id, user_identity_photo, user_identity_front_id, user_identity_back_id, user_identity_status, user_identity_created_at, user_identity_id_type) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    user_identity_status = VALUES(user_identity_status)`,
    [user, imageP, imageFrontID, imageBackID, status, createdAt, selectedID],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error occurred while updating or inserting data");
      } else {
        res.send(results);
      }
    }
  );
});


app.post("/BussLikes", (req, res) => {
  const user = req.body.user;
  const bussNameSelectd = req.body.bussNameSelectd;
  // const createdAt =  req.body.createdAt;
  
  
  
    db.query(
      "INSERT INTO user_business_likes (userbusslikes_data, userbusslikes_created_at, userbusslikes_user_id ) VALUES (?,?,?)",
      [ bussNameSelectd, createdAt, user],
  (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.send(results);
    }
  }
  );
  
  });

  app.post("/CheckUserLikes", (req, res) => {
    const user = req.body.user;
      db.query(
        "SELECT * FROM user_business_likes WHERE userbusslikes_user_id = ?",
        [user],
    (error, results) => {
      if (error) {
        return res.send({ success: false, error: error });

      } else {
        res.send({
          success: true,
          results});
      }
    }
    );
    
    });
    

  
  app.post("/ProfileEntrepFeeds", (req, res) => {
    const userType = "entrepreneur";
    const status = "pending";
    const id = req.body.user;
  
    db.query(
      "select business.*, usertbl.* ,businessapproved.*,  investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname , investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where buss_status = ? and usertbl.user_type = ? and usertbl.user_id = ?",
      [status, userType, id],
      (error, result) => {
        if (error) {
          return res.send({ success: false, error: error });
        } else {
          const businessWithInvestment = [];
  
          const resultsSet = result;
  
          resultsSet.forEach((row) => {
            let business = businessWithInvestment.find(
              (item) => item.buss_id === row.buss_id
            );
  
            if (!business) {
              business = {
                buss_id: row.buss_id,
                buss_name: row.buss_name,
                buss_type: row.buss_type,
                buss_type_name: row.buss_type_name,
                buss_address: row.buss_address,
                buss_photo: row.buss_photo,
                buss_station: row.buss_station,
                buss_station_name: row.buss_station_name,
                buss_experience: row.buss_experience,
                buss_prev_name: row.buss_prev_name,
                buss_summary: row.buss_summary,
                buss_target_audience: row.buss_target_audience,
                buss_useof_funds: row.buss_useof_funds,
                buss_capital: row.buss_capital,
                buss_approved_updated_year: row.buss_approved_updated_year,
                buss_approved_percent: row.buss_approved_percent,
                buss_created_at:row.buss_created_at,
                buss_status: row.buss_status,
                totalAmountInvts:row.totalAmountInvts,
  
                user_profile: row.user_profile,
                user_id: row.user_id,
                user_fname: row.user_fname,
                user_lname: row.user_lname,
                investments: [],
              };
              businessWithInvestment.push(business);
            }
  
            business.investments.push({
              investor_id: row.investor_id,
              investor_profile: row.investor_profile,
              investor_fname: row.investor_fname,
              investor_lname: row.investor_lname,
              invest_amount: row.invst_amt,
            });
          });
  
          return res.send({
            success: true,
            result: businessWithInvestment,
            filterData: businessWithInvestment,
          });
        }
      });
  });
  


  app.post("/BussInvestorList", (req, res) => {
    const userType = "entrepreneur";
    const status = "approved";
    const user_id = req.body.user_id;
  
    //To check if business is new or not
    const isItemNew = (created_at) => {
      const currentDate = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
      const createdDate = new Date(created_at);
  
      return createdDate >= oneMonthAgo && createdDate <= currentDate;
    };
  
    //To calulcate to invest
    const calculateTotalInvest = (investment) => {
      const investDetails = investment.map((item) => item.invest_amount);
  
      let totalSum = 0;
  
      for (let i = 0; i < investDetails.length; i++) {
        totalSum += parseFloat(investDetails[i]);
      }
      if (totalSum) {
        return totalSum;
      } else {
        return 0;
      }
    };
    //Functuon for recomeneded
    const removeDuplicateBussID = (array) => {
      const seenIds = {};
      const duplicates = [];
      const uniqueItems = [];
      for (const item of array) {
        const id = item.buss_id;
  
        if (seenIds[id]) {
          duplicates.push(id);
        } else {
          seenIds[id] = true;
          uniqueItems.push(item);
        }
      }
  
      return uniqueItems;
    };
  
    db.query(
      "select * from user_business_likes where userbusslikes_user_id = ? ",
      user_id,
      (errors, resultsLike) => {
        if (errors) {
          console.log(errors);
          return res.send({ status: false, message: errors.message });
        } else {
          db.query(
            "select business.*, usertbl.* ,businessapproved.*, investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where buss_status = ? and usertbl.user_type = ? order by buss_id desc",
            [status, userType],
            (error, result) => {
              if (error) {
                return res.send({ success: false, error: error });
              } else {
                const businessWithInvestment = [];
  
                const resultsSet = result;
  
                resultsSet.forEach((row) => {
                  let business = businessWithInvestment.find(
                    (item) => item.buss_id === row.buss_id
                  );
  
                  if (!business) {
                    business = {
                      buss_id: row.buss_id,
                      buss_name: row.buss_name,
                      buss_type: row.buss_type,
                      buss_type_name: row.buss_type_name,
                      buss_address: row.buss_address,
                      buss_photo: row.buss_photo,
                      buss_station: row.buss_station,
                      buss_station_name: row.buss_station_name,
                      buss_experience: row.buss_experience,
                      buss_prev_name: row.buss_prev_name,
                      buss_summary: row.buss_summary,
                      buss_target_audience: row.buss_target_audience,
                      buss_useof_funds: row.buss_useof_funds,
                      buss_capital: row.buss_capital,
                      buss_created_at: row.buss_created_at,
                      isNew: isItemNew(new Date(row.buss_approved_created_at)),
                      buss_approved_updated_month:
                        row.buss_approved_updated_month,
                      buss_approved_percent: row.buss_approved_percent,

                      totalAmountInvts:row.totalAmountInvts,
                      user_profile: row.user_profile,
                      user_id: row.user_id,
                      user_fname: row.user_fname,
                      user_lname: row.user_lname,
                      investments: [],
                    };
                    businessWithInvestment.push(business);
                  } else {
                    business.isNew = isItemNew(
                      new Date(row.buss_approved_created_at)
                    );
                  }
  
                  business.investments.push({
                    investor_id: row.investor_id,
                    investor_profile: row.investor_profile,
                    investor_fname: row.investor_fname,
                    investor_lname: row.investor_lname,
                    invest_amount: row.invst_amt,
                  });
                });
  
              //To get the data if business that investments amount are not equal to the capital
              const data = businessWithInvestment.filter((item) => {
                if (
                  item.buss_capital !== calculateTotalInvest(item.investments)
                ) {
                  return item;
                }
              });
              //Business that has an investors
              const withInvestors = data.filter((item) => {
                const investments = item.investments;

                if (
                  Array.isArray(investments) &&
                  investments.some((data) => data.investor_id)
                ) {
                  return true;
                }

                return false;
              });
              if (resultsLike.length > 0) {
                const likedTypesString = resultsLike[0].userbusslikes_data;
                const likedTypes = JSON.parse(likedTypesString);

                const filteredBusinessArray = data.filter((business) => {
                  const businessTypes = JSON.parse(business.buss_type_name);

                  return likedTypes.some((likedType) =>
                    businessTypes.includes(likedType.name)
                  );
                });
                const recomended = removeDuplicateBussID([
                  ...withInvestors,
                  ...filteredBusinessArray,
                  ...businessWithInvestment
                ]);

                //Result of this is for the recommended
                //It works by joining withInvestors and the filteredBusiessArray and return a data which are not duplicated

                return res.send({
                  success: true,
                  result: businessWithInvestment,
                  filterData: data,
                  likesofInvestors: resultsLike,
                  hasLikes: true,
                  withInvestors,
                  recomended,
                });
              } else {
                return res.send({
                  success: true,
                  result: businessWithInvestment,
                  filterData: data,
                  // likesofInvestors: resultsLike,
                  hasLikes: false,

                  withInvestors,
                });
              }
              //For investor likes business
            }
          }
        );
      }
    }
  );
});
    
app.post("/getTotalInvestAmount", (req, res) => {
  const { buss_id } = req.body;

  db.query(
    "select sum(invst_amt) as totalInvstAmt from investment left join businessapproved on investment.invst_buss_approved_buss_id = businessapproved.buss_approved_buss_id where buss_approved_buss_id = ? order by buss_approved_buss_id",
    buss_id,
    (error, result) => {
      if (error) {
        return res.send({ status: false, message: error.message });
      } else {
        return res.send({ status: true, result });
      }
    }
  );
});


app.post("/updateInvestment", (req, res) => {
  const {
    type,
    amount,
    email,
    paypalLog,
    updateType,
    invst_id,
    user_id,
    summaryTotalAmount,
    summaryInterest,
    summaryReturn,
  } = req.body;
  const invstUpdateType = "change_details";
  const currentDate = new Date();
  const date = currentDate.toISOString().slice(0, 19).replace("T", " ");
  const transactionsSql =
    "insert into transactions (transac_type, transac_amt, transac_email, transac_created_at,transac_paypal_datalog, transac_user_id) values(?,?,?,?,?,?)";

  const updateInvestAmount =
    "update investment set invst_amt= ?, invst_returned_amt = ?, invst_interest_sum = ? where invst_id = ?";

  const investUpdateTable =
    "insert into investment_update (invst_update_type, invst_updated_crearted_at, invst_update_invst_id) value(?,?,?) ";
  console.log(invst_id);
  db.query(
    transactionsSql,
    [type, amount, email, date, paypalLog, user_id],
    (error, result) => {
      if (error) {
        return res.send({ status: false, message: error.message });
      } else {
        db.query(
          updateInvestAmount,
          [
            parseFloat(summaryTotalAmount),
            parseFloat(summaryReturn),
            parseFloat(summaryInterest),
            parseInt(invst_id),
          ],
          (error, result) => {
            if (error) {
              return res.send({ status: false, message: error.message });
            } else {
              db.query(
                investUpdateTable,
                [invstUpdateType, date, parseInt(invst_id)],
                (error, result) => {
                  if (error) {
                    return res.send({ status: false, message: error.message });
                  } else {
                    return res.send({
                      status: true,
                      message: "Updated Successfully",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});


app.post("/sendCodetoEmail", (req, res) => {
  const email = req.body.email;
  const code = req.body.code
  const templateParams = {
      to_name: email,
      message: code,
      send_to: email,
  };
      emailjs.send("service_277wgg9", "template_crejuxe", templateParams, {
        publicKey: "SpBOvjyD_Lmx07hlo",
        privateKey: "SUZLr0cXYR1I4pQTjdrEZ", // optional, highly recommended for security reasons
     }).then(
      (response) => 
        {
          res.send({ status: true, message: "Success send", code:code });
          console.log("SUCCESS!", response.status, response.text);
      },
      (err) => 
      {
        console.log("FAILED...", err);
      }
 );
});


app.post("/submitfeedback", (req, res) => {
  const { feedbackContent, rating, EntrepId, invstId } = req.body;

  db.query(
    "insert into feedbackandratings (feedbackrate_content, feedbackrate_count,feedbackrate_entrep_user_id, feedbackrate_created_at) values (?,?,?,?)",
    [feedbackContent, rating, EntrepId, createdAt],
    (error, result) => {
      if (error) {
        return res.send({ status: false, message: error.message });
      } else {
        const withdraw_status = "receive";
        db.query(
          "update withdraw set withdraw_status = ? where withdraw_invst_id = ? ",
          [withdraw_status, invstId],
          (error, result) => {
            if (error) {
              return res.send({ status: false, message: error.message });
            } else {
              const invstStat = "complete";
              db.query(
                "update investment set invst_status = ? where invst_id = ?",
                [invstStat, invstId],
                (error, result) => {
                  if (error) {
                    return res.send({ status: false, message: error.message });
                  } else {
                    return res.send({
                      status: true,
                      message: "Your feedback has been succeffuly submit",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});




            
/////////////////END OF FINAL SQL





app.get("/userss", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  const name = req.body.name;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO users (fullname, email, pass) VALUES (?, ?, ?)",
    [name, email, pass],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

app.post("/testing", (req, res) => {
  const userType = req.body.userType;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.middleName;
  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO testing (user_type, user_firstname, user_lastname, user_middlename,) VALUES (?, ?, ?, ?)",
    [userType, firstName, lastName, middleName,],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});



app.post("/image", (req, res) => {
  const imageURL = req.body.imageURL;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO image (img_url) VALUES (?)",
    [imageURL],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

app.get("/getImage", (req, res) => {
  const sql = "SELECT * FROM image";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});


app.get("/getData", (req, res) => {
  const sql = "SELECT * FROM usertbl";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});



app.get("/getLogin", (req, res) => {

    const sql = "SELECT * FROM usertbl WHERE user_email = ? AND user_pass = ?";
  db.query(sql, (error, results) => {
  if (error) {
    console.log(error);
    return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})

  } 
  else {
    return res.send({ success: true, results})

  }
}
);

});


//local
app.post("/testLogin", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  db.query(
        "SELECT * FROM usertbl WHERE user_email = ? AND user_password = ? ",
        
    [email, pass],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        if(results.length>0){
        return res.send({ success: true, results})

        }
        else{
        return res.send({ success: false})
          
        }
    
      }
        }
  );
});



app.post("/testID", (req, res) => {
  const id = req.body.user;
  const pass = req.body.pass;

  db.query(
        "SELECT * FROM usertbl WHERE user_id = ?  ",
        // "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where user_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log("testID");

        console.log(error);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});


app.post("/statusID", (req, res) => {
  const id = req.body.user;
  const pass = req.body.pass;
  db.query(
        "SELECT * FROM user_identity WHERE user_identity_user_id = ?  ",
    [id],
    (error, results) => {
      if (error) {
        console.log("statusID");

        console.log(error);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});



app.post("/ProfileFeeds", (req, res) => {
  const id = req.body.user;
  const pass = req.body.pass;

  db.query(
        // "SELECT * FROM usertbl WHERE user_id = ?  ",
        "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where buss_status = 'Pending' and user_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});










app.post("/pitch", (req, res) => {
  const user = req.body.user;
const businessName = req.body.businessName;
const businessTypeSelectd = req.body.businessTypeSelectd;
const businessCapital = req.body.businessCapital;
const businessDetails =  req.body.businessDetails;
// const selectedProvince =  req.body.selectedProvince;
// const selectedCity =  req.body.selectedCity;
// const selectedBrgy =  req.body.selectedBrgy;
const address = req.body.selectedProvince + ", " + req.body.selectedCity + ", " + req.body.selectedBrgy;
// const createdAt =  req.body.createdAt;
const imageURL =  req.body.imageURL;



  db.query(
    "INSERT INTO business (buss_name, buss_type, buss_capital, buss_address, buss_photo, buss_details, buss_created_at, buss_user_id ) VALUES (?,?,?,?,?,?,?,?)",
    [businessName, businessTypeSelectd,  businessCapital, address, imageURL, businessDetails, createdAt, user],
(error, results) => {
  if (error) {
    console.log(error);
  } else {
    res.send(results);
  }
}
);

});




app.post("/signup", (req, res) => {
  const userType = req.body.userType;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.middleName;
  const bDate = req.body.bDate;
  const gender = req.body.gender;
  const contactNum = req.body.contactNum;
  const email = req.body.email;
  const pass = req.body.pass;
  const provinceData = req.body.selectedProvince;
  const cityData = req.body.selectedCity;
  const brgyData = req.body.selectedBrgy;
  // const createdAt = req.body.createdAt;


  db.query(
    "INSERT INTO usertbl (user_type, user_fname, user_lname, user_mname, user_bdate, user_gender, user_contact_num, user_email, user_password, user_province, user_city, user_barangay, user_created_at ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [userType, firstName, lastName, middleName, bDate, gender, contactNum, email, pass,  provinceData, cityData, brgyData,createdAt],
(error, results) => {
  if (error) {
    console.log(error);
    // res.send({ success: false})

    // switch(error.errno) {
    //   case 1062:
    //     console.log("error")
    //     return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    //     break;
    // }
    return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})



  } else {
    // res.send(results);
    return res.send({ success: true, results})

  }
}
);

});






app.post("/duplication", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  const name = req.body.name;

  db.query(
        "SELECT * FROM users WHERE email = ? ",
    [name, email, pass],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );

});

  app.post("/updateprofile", (req, res) => {
    // const userType = req.body.userType;
    const id = req.body.id;

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const middleName = req.body.middleName;
    const bDate = req.body.bDate;
    const gender = req.body.gender;
    const contactNum = req.body.contactNum;
    const email = req.body.email;
    const pass = req.body.pass;
    // const regionData = req.body.regionData;
    const provinceData = req.body.selectedProvince;
    const cityData = req.body.selectedCity;
    const brgyData = req.body.selectedBrgy;
    // const createdAt = req.body.createdAt;
  
  
  
  
    db.query(
      // "UPDATE INTO usertbl ( user_firstname, user_lastname, user_middlename, user_bdate, user_gender, user_contct_num, user_email, user_pass, user_province, user_city, user_brgy, user_created_at ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      // [ firstName, lastName, middleName, bDate, gender, contactNum, email, pass,  provinceData, cityData, brgyData,createdAt],

      "UPDATE usertbl SET user_type = ?, user_fname = ?, user_lname = ?, user_mname = ?, user_bdate = ?, user_gender = ?, user_contact_num = ?, user_email = ?, user_password = ?, user_province = ?, user_city = ?, user_barangay = ?, user_updated_at WHERE usertbl.user_id  = ?",
    [firstName, lastName, middleName, bDate, gender, contactNum, email, pass,  provinceData, cityData, brgyData,createdAt, ],

  (error, results) => {
    if (error) {
      console.log(error.errno);
      return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
  
    } else {
      // res.send(results);
      return res.send({ success: true, results})
  
    }
  }
  );
  
  });
  
  


app.get("/getBusiness", (req, res) => {
  const sql = "SELECT * FROM business";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});



// select * from usertbl inner join business on business.buss_user_id = usertbl.user_id ;
app.get("/getFeedsDisplay", (req, res) => {
  // const sql = "SELECT * FROM usertbl INNER JOIN business ON business.buss_user_id = usertbl.user_id";

  // const sql = "SELECT * FROM usertbl  INNER JOIN business ON usertbl.user_id = business.buss_user_id  INNER JOIN investment ON business.buss_user_id = investment.invst_user_id" ;
  const sql = "select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts  from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_approved_buss_id  where buss_status = 'Pending' and usertbl.user_type = 'entrepreneur' GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc"

  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});



// Define API endpoints for sending notifications
app.post('/sendNotification', (req, res) => {
  // Implement the logic to send notifications here

  
});




app.post("/fileUpload", (req, res) => {
  const fileURL = req.body.fileURL;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO files (file_url) VALUES (?)",
    [fileURL],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

app.get("/getFile", (req, res) => {
  const sql = "SELECT * FROM files";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});




app.post("/notif", (req, res) => {
  const msg = req.body.notifMsg;
  const user = req.body.user;
  // const createdAt = req.body.createdAt;
  const findBussinessUser = req.body.findBussinessUser;
  const findBussinessID = req.body.findBussinessID;
  const invstID = req.body.invstID;


  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO notification (notif_content, notif_created_at, user_id_reciever, user_id_sender,  user_buss_id,invst_id) VALUES (?,?,?,?,?,?)",
    [msg, createdAt,user, findBussinessUser, findBussinessID,invstID ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Inserted")
        res.send(results);
      }
    }
  );
});




app.post("/getNotifDisplay", (req, res) => {
  const user = req.body.user;

  db.query(
        "SELECT * FROM usertbl INNER JOIN notification ON  notification.user_id_reciever = usertbl.user_id  where user_id_sender = ?; ",
        // "SELECT * FROM usertbl INNER JOIN notificationtest ON  notificationtest.user_id_reciever = usertbl.user_id  where user_id_sender = ?; ",

    [user],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );

});






app.post("/testbussID", (req, res) => {
  // const user = req.body.user;

  db.query(
        "SELECT * FROM usertbl RIGHT JOIN business ON business.buss_user_id = usertbl.user_id",
  //  [user],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        if(results.length>0){
        return res.send({ success: true, results})

        }
        else{
        return res.send({ success: false})
          
        }
    
      }
        }
  );
});




app.post("/investment", (req, res) => {
  // const percent = req.body.percent;
  // const year = req.body.year;
  const year = 1;
  // const startDate = req.body.startDate;
  // const endDate = req.body.endDate;
  // const percentReturn = req.body.percentReturn;
  const amount = req.body.amountToInvest;
  // const interest = req.body.interest;
  const interest = 2;
  // const createdAt = req.body.createdAt;
  const user = req.body.user;
  const findBussinessID = req.body.findBussinessID;
  const findBussinessUser = req.body.findBussinessUser;
  const invstType = "annuity"
  const type = "investment"
  const amountAt = parseFloat(amount) * -1;





  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO investment (invst_amt, invst_num_year,  invst_interest, invst_created_at, invst_user_id	, invst_buss_id, invst_buss_user_id, invst_type	 ) VALUES (?,?,?,?,?,?,?,?)",
    [amount, year, interest, createdAt, user, findBussinessID, findBussinessUser,invstType  ],
    (error, results) => {


      // if (error) {
      //   console.log(error);
      // } else {
      //   res.send(results);
      // }

      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})


      //   db.query(
      //     "INSERT INTO wallet (wlt_user_id, user_amt, wlt_trans_type ) VALUES (?,?,?)",
      //     [user,amountAt, type],
      //    (error, results) => {
     
      //      if (error) {
      //        console.log(error.errno);
      //        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
         
      //      } 
      //      else {
     
      //        return res.send({ success: true, results})
             
      //        // console.log(results);
      //       //  const wallet_id = results.insertId
     
      //       //  db.query(
      //       //    "INSERT INTO transactions (trans_amt,trans_email,trans_created_at,wlt_id ) VALUES (?,?,?,?)",
      //       //    [amount,email, createdAt,wallet_id],
      //       //   (error, results) => {
          
      //       //     if (error) {
      //       //       console.log(error.errno);
      //       //       return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
              
      //       //     } 
      //       //     else {
          
      //       //       return res.send({ success: true, results})
      //       //     }
          
          
          
      //       //   }
      //       // );
      //      }
      //    }
      //  );
     
       
    
      }



    }
  );
});


app.post("/investmentwallet", (req, res) => {
  const amount = req.body.amountToInvest;
  const user = req.body.user;
  const type = "investment"
  const amountAt = parseFloat(amount) * -1;



        db.query(
          "INSERT INTO wallet (wlt_user_id, user_amt, wlt_trans_type ) VALUES (?,?,?)",
          [user,amountAt, type],
         (error, results) => {
     
           if (error) {
             console.log(error.errno);
             return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
         
           } 
           else {
     
             return res.send({ success: true, results})
             
             // console.log(results);
            //  const wallet_id = results.insertId
     
            //  db.query(
            //    "INSERT INTO transactions (trans_amt,trans_email,trans_created_at,wlt_id ) VALUES (?,?,?,?)",
            //    [amount,email, createdAt,wallet_id],
            //   (error, results) => {
          
            //     if (error) {
            //       console.log(error.errno);
            //       return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
              
            //     } 
            //     else {
          
            //       return res.send({ success: true, results})
            //     }
          
          
          
            //   }
            // );
           }
         }
       );
     
       
    
});





app.get("/getIDimage", (req, res) => {
  const sql = "SELECT * FROM informationImages";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});






app.post("/BussStatus", (req, res) => {
  const status = req.body.status;
  const bussID = req.body.bussID;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "UPDATE business SET buss_status = ? WHERE buss_id = ?;   ",
    [status, bussID ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Updated")
        res.send(results);
      }
    }
  );
});


// app.get("/displayInvestor", (req, res) => {
//   // const sql = "SELECT * FROM usertbl INNER JOIN business ON usertbl.user_id = business.buss_user_id INNER JOIN investment ON business.buss_user_id = investment.invst_user_id where buss_id=?";
//   const buss_id = req.body.bussid;

//   const sql ="SELECT * FROM usertbl INNER JOIN business ON usertbl.user_id = business.buss_user_id INNER JOIN investment ON business.buss_id = investment.invst_buss_id where buss_id=? ";
//   db.query(sql,  [buss_id ], (error, data) => {
//     if (error) {
//       console.log(error);
//     } else {
//       return res.send(data);
//     }
//   });
// });

app.post("/displayInvestor", (req, res) => {
  const buss_id = req.body.bussid;
// console.log(buss_id);
  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
    //  "SELECT * FROM usertbl INNER JOIN business ON usertbl.user_id = business.buss_user_id INNER JOIN investment ON business.buss_id = investment.invst_buss_id where buss_id=?",
     "SELECT * FROM usertbl INNER JOIN investment ON usertbl.user_id = investment.invst_user_id INNER JOIN business on business.buss_id = investment.invst_buss_id WHERE buss_id=?",
    [buss_id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});




app.post("/InvsmntStatusDecline", (req, res) => {
  const statusDecline = req.body.statusDecline;
  const userID = req.body.userID;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "UPDATE investment SET invst_status = ? WHERE invst_user_id = ?;   ",
    [statusDecline, userID ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Updated")
        res.send(results);
      }
    }
  );
});

app.post("/InvsmntStatusAccepted", (req, res) => {
  const statusAccepted = req.body.statusAccepted;
  const userID = req.body.userID;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "UPDATE investment SET invst_status = ? WHERE invst_user_id = ?;   ",
    [statusAccepted, userID ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Updated")
        res.send(results);
      }
    }
  );
});



app.post("/invstmntView", (req, res) => {
  const userData = req.body.userData;
  const notifId = req.body.notifId;


  db.query(
    //  "INSERT INTO files (file_url) VALUES (?)",
     "select business.*, usertbl.*,notification.* from business left join usertbl on usertbl.user_id=  business.buss_user_id left join notification on business.buss_id = notification.user_buss_id where notification.user_id_reciever  = ? and notification.notif_id = ? ",
    [userData,notifId],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});



app.post("/InvstmentFeeds", (req, res) => {
  const id = req.body.userID;
  const notifID = req.body.notifID;
  const bussID = req.body.bussID;
  const invstID = req.body.invstID;



  db.query(
        // "SELECT * FROM usertbl WHERE user_id = ?  ",
        // "select notification.*, usertbl.*,business.* from business left join usertbl on usertbl.user_id=  business.buss_user_id left join notification on business.buss_id = notification.user_buss_id where notification.user_id_reciever = ? and notification.notif_id = ? and business.buss_id=?",
        // "SELECT * FROM usertbl INNER JOIN notification ON usertbl.user_id = notification.user_id_reciever where notification.notif_id=?",
        // "select  usertbl.*,notification.*,business.* from business left join usertbl on usertbl.user_id=  business.buss_user_id left join notification on business.buss_id = notification.user_buss_id where usertbl.user_id = ? and notification.user_id_reciever = ? and notification.notif_id =?",
    // [id,id,notifID],

    "SELECT * FROM usertbl INNER JOIN investment ON usertbl.user_id = investment.invst_user_id INNER JOIN business on business.buss_id = investment.invst_buss_id WHERE invst_id = ?",
    [invstID],

    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});








app.get("/UserList", (req, res) => {
  const sql = "SELECT * FROM usertbl";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});



app.post("/wallet", (req, res) => {
  
  const amount = req.body.amount;
  const user = req.body.user;
  const type = req.body.type;
  const name = req.body.name;
  const email = req.body.email;
  const formattedDate = req.body.formattedDate;

  
  db.query(
     "INSERT INTO wallet (wlt_user_id, user_amt, wlt_trans_type ) VALUES (?,?,?)",
     [user,amount, type],
    (error, results) => {

      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        // return res.send({ success: true, results})
        // console.log(results);
        const wallet_id = results.insertId

        db.query(
          "INSERT INTO transactions (trans_amt,trans_email,trans_created_at,wlt_id ) VALUES (?,?,?,?)",
          [amount,email, formattedDate,wallet_id],
         (error, results) => {
     
           if (error) {
             console.log(error.errno);
             return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
         
           } 
           else {
     
             return res.send({ success: true, results})
           }
     
     
     
         }
       );
      }
    }
  );
});


app.post("/WalletSum", (req, res) => {
  const id = req.body.user;

  db.query(
    "select sum(user_amt) as totalamount from wallet where wlt_user_id = ?",
    // "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where user_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});






app.post("/handleSendCode", (req, res) => {
  const email = req.body.email;
 
  db.query(
        "SELECT * FROM usertbl WHERE user_email = ?",
        
    [email],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        if(results.length>0){
        return res.send({ success: true, results, code: "1234"})

        }
        else{
        return res.send({ success: false})
          
        }
    
      }
        }
  );
});



// app.post("/UpdateUserPass", (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password
//   db.query(
//         "UPDATE usertbl SET user_password = ? where user_email = ?",
//     [email,password],
//     (error, results) => {
//       if (error) {
//         // console.log(error);
//         return res.send({status: false, message: error.message})
//       } 
//       else {
//         return res.send({status: true, message:"Password Changed"})
//       }
//     }
//   );

// });


app.post("/UpdateUserPass", (req, res) => {
  const email = req.body.email;
  const password = req.body.password
  const hash = bcrypt.hashSync(password, salt);

  
  db.query(
      "UPDATE usertbl SET user_password = ? where user_email = ?",
  [hash, email],
      (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Updated")
        res.send(results);
      }
    }
  );
});


// app.post("/updateProfilee", (req, res) => {
//   const user = req.body.user;
//   const userType = req.body.userType;
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const middleName = req.body.middleName;
//   const imageURL = req.body.imageURL;
//   const bDate = req.body.bDate;
//   const gender = req.body.gender;
//   const contactNum = req.body.contactNum;
//   const email = req.body.email;
//   const pass = req.body.pass;
//   const provinceData = req.body.selectedProvince;
//   const cityData = req.body.selectedCity;
//   const brgyData = req.body.selectedBrgy;
//   const createdAt = req.body.createdAt;


//   db.query(
//     "UPDATE usertbl SET user_type = ?, user_fname = ?, user_lname = ?, user_mname = ?, user_profile_photo = ?, user_bdate = ?, user_gender = ?, user_contact_num = ?, user_email = ?, user_password = ?, user_province = ?, user_city = ?, user_barangay = ?, user_updated_at = ? WHERE usertbl.user_id = ?",
//       [userType, firstName, lastName, middleName, imageURL, bDate, gender, contactNum, email, pass,  provinceData, cityData, brgyData,createdAt,user],
// (error, results) => {
//   if (error) {
//     console.log(error.errno);
//     console.log("failed")
//     return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
//   } else {
//     // res.send(results);
//     console.log("success")
//     return res.send({ success: true, results})

//   }
// }
// );

// });



app.post("/updateProfilee", (req, res) => {
  const user = req.body.user;
  const updateData = req.body;

  // Retrieve existing data for the user from the database
  db.query(
    "SELECT * FROM usertbl WHERE user_id = ?",
    [user],
    (selectError, selectResults) => {
      if (selectError) {
        console.log(selectError.errno);
        console.log("failed to retrieve existing data");
        return res.send({ success: false, failed: selectError.sqlMessage, errorNum: selectError.errno });
      }

      if (selectResults.length === 0) {
        return res.send({ success: false, message: "User not found." });
      }

      const existingData = selectResults[0];

      // Merge the existing data with the new data, but prioritize new data if it exists
      const updatedData = {
        user_type: updateData.userType || existingData.user_type,
        user_fname: updateData.firstName || existingData.user_fname,
        user_lname: updateData.lastName || existingData.user_lname,
        user_mname: updateData.middleName || existingData.user_mname,
        user_profile_photo: updateData.imageURL || existingData.user_profile_photo,
        user_bdate: updateData.bDate || existingData.user_bdate,
        user_gender: updateData.gender || existingData.user_gender,
        user_contact_num: updateData.contactNum || existingData.user_contact_num,
        user_email: updateData.email || existingData.user_email,
        user_password: updateData.pass || existingData.user_password,
        user_province: updateData.selectedProvince || existingData.user_province,
        user_city: updateData.selectedCity || existingData.user_city,
        user_barangay: updateData.selectedBrgy || existingData.user_barangay,
        user_updated_at: updateData.createdAt || new Date(),
      };

      // Update the database with the merged data
      db.query(
        "UPDATE usertbl SET user_type = ?, user_fname = ?, user_lname = ?, user_mname = ?, user_profile_photo = ?, user_bdate = ?, user_gender = ?, user_contact_num = ?, user_email = ?, user_password = ?, user_province = ?, user_city = ?, user_barangay = ?, user_updated_at = ? WHERE user_id = ?",
        [
          updatedData.user_type,
          updatedData.user_fname,
          updatedData.user_lname,
          updatedData.user_mname,
          updatedData.user_profile_photo,
          updatedData.user_bdate,
          updatedData.user_gender,
          updatedData.user_contact_num,
          updatedData.user_email,
          updatedData.user_password,
          updatedData.user_province,
          updatedData.user_city,
          updatedData.user_barangay,
          updatedData.user_updated_at,
          user,
        ],
        (updateError, updateResults) => {
          if (updateError) {
            console.log(updateError.errno);
            console.log("failed");
            return res.send({ success: false, failed: updateError.sqlMessage, errorNum: updateError.errno });
          } else {
            console.log("success");
            return res.send({ success: true, results: updateResults });
          }
        }
      );
    }
  );
});



app.post("/getNotifContent", (req, res) => {
  const user = req.body.user;
  db.query(
    " SELECT notif_content as content from notification WHERE notif_status = 'unread' AND user_id_sender = ? limit 1",
    [user],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});
