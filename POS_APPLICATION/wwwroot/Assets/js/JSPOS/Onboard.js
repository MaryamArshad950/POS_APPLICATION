!function () {
    $(document).ready(function () {
        $('#CUOCP_FSCD_ID').select2();
        $(".select2-container").addClass("w-100");
        $(".select2-selection").addClass("h-75");
        //ProcessGlobalCore(coresession);
        //getCoreSessions();
        if (sessionStorage.getItem("tokenIndex") != null) {
            let sessionPos = sessionStorage.getItem("tokenIndex");
            ProcessGlobalCore(sessionPos);
        }
        //if (sessionStorage.getItem("cnic.") != null || sessionStorage.getItem("DocCNIC") != null) {
        //    if (sessionStorage.getItem("GlobalPos") != null) {
        //        let sessionPos = sessionStorage.getItem("GlobalPos");
        //        ProcessGlobalCore(sessionPos);
        //    } if ((sessionStorage.getItem("token") != '' || sessionStorage.getItem("token") != null) && sessionStorage.getItem("DocCNIC") != null && sessionStorage.getItem("GlobalPos") == null) {
        //        if (sessionStorage.getItem("token") == '') {
        //            if (localStorage.getItem("token1") != null) {
        //                let sessionPos = localStorage.getItem("token1");
        //                ProcessGlobalCore(sessionPos);
        //            }
        //            if (localStorage.getItem("token3") != null) {
        //                let sessionPos = localStorage.getItem("token3");
        //                ProcessGlobalCore(sessionPos);
        //            }
        //        }
        //        else {
        //            let sessionPos = localStorage.getItem("token");
        //            ProcessGlobalCore(sessionPos);
        //        }
        //    }
            
        //    let sessionCNIC = '';
        //    //let sessionPos = sessionStorage.getItem("GlobalPos");
        //    if (sessionStorage.getItem("cnic.") != null) {
        //        sessionCNIC = sessionStorage.getItem("cnic.").replace(/^(\d{5})(\d{7})(\d)$/, "$1-$2-$3");
        //        fillCustomerInfo(sessionCNIC, coresession)
        //    }
        //    else {
        //        sessionCNIC = sessionStorage.getItem("DocCNIC");
        //        fillCustomerInfo(sessionCNIC, coresession)
        //    }
        //}

        if (sessionStorage.getItem("cnic.") == null && sessionStorage.getItem("DocCNIC") == null) {
            //getCoreSessions();
            //ProcessGlobalCore(coresession);
            $.post("/User/createDefaultPOSAcc", function (token) {
                sessionStorage.setItem("GlobalPos", token);
                getFinancialQues(token);
                ProcessGlobalCore(token);
            });
        }
        else {
            let sessionCNIC = '';
            if (sessionStorage.getItem("cnic.") != null) {
                sessionCNIC = sessionStorage.getItem("cnic.").replace(/^(\d{5})(\d{7})(\d)$/, "$1-$2-$3");
                fillCustomerInfo(sessionCNIC)
            }
            if (sessionStorage.getItem("DocCNIC") != null) {
                sessionCNIC = sessionStorage.getItem("DocCNIC");
                fillCustomerInfo(sessionCNIC)
            }
            if (sessionStorage.getItem("GlobalPos") != null && sessionStorage.getItem("token") == '') {
                let sessionPos = sessionStorage.getItem("GlobalPos");
                ProcessGlobalCore(sessionPos);
            }
            if ((sessionStorage.getItem("token") != '' || sessionStorage.getItem("token") != null) && sessionStorage.getItem("DocCNIC") != null) {
                if (sessionStorage.getItem("token") == '') {
                    if (localStorage.getItem("token1") != null) {
                        let sessionPos = localStorage.getItem("token1");
                        ProcessGlobalCore(sessionPos);
                    }
                    if (localStorage.getItem("token3") != null) {
                        let sessionPos = localStorage.getItem("token3");
                        ProcessGlobalCore(sessionPos);
                    }
                }
                else {
                    //let sessionPos = getsession;
                    ProcessGlobalCore(sessionStorage.getItem("token"));
                }
            }            
        }
        let nf = new Intl.NumberFormat('en-US');
        if (sessionStorage.getItem("GlobalPos") != null) {
            getFinancialQues(sessionStorage.getItem("GlobalPos"));
        }
        if (sessionStorage.getItem("token") != null) {
            getFinancialQues(sessionStorage.getItem("token"));
        }
        if (sessionStorage.getItem("tokenIndex") != null) {
            getFinancialQues(sessionStorage.getItem("tokenIndex"));
        }

        if ((sessionStorage.getItem("token") == "" || sessionStorage.getItem("token") == "null") && localStorage.getItem("token1") != "" && sessionStorage.getItem("User") != null) {
            sessionStorage.setItem("token", localStorage.getItem("token1"));
        }
        if ((sessionStorage.getItem("token") == "" || sessionStorage.getItem("token") == "null") && localStorage.getItem("token1") == null && localStorage.getItem("token3") != "" && sessionStorage.getItem("User") != null) {
            sessionStorage.setItem("token", localStorage.getItem("token3"));
        }

        if (sessionStorage.getItem("DocCNIC") != null) {
            let sessionPos = getSessionpos();
            $("#FCDM_OWCUST_CNIC").attr("readonly", true);
            $("#FCDM_OWCUST_CNIC").addClass("readonly");
            $("#FCDM_OWCUST_CNIC").val(sessionStorage.getItem("DocCNIC"));
            let custcode = sessionStorage.getItem("DocCNIC").replaceAll("-", "");
            $.ajax({
                "crossDomain": true,
                url: "" + Result_API + "/api/TakafulHist/GetUserTakafulHistory/" + custcode,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + sessionPos
                },
                datatype: 'jsonp',
                success: function (result) {
                    if (result.length != 0) {
                        $(result).each(function () {
                            if (this.FCIH_INSUREREXIST_YN == "N") {
                                $("#INSUREREXIST_N").attr("checked", true)
                            }
                            if (this.FCIH_INSUREREXIST_YN == "Y") {
                                if (this.FCIH_START_DATE != null && this.FCIH_MATURITY_DATE != null) {
                                    let FCIH_START_DATE = this.FCIH_START_DATE.slice(0, 10);
                                    let FCIH_MATURITY_DATE = this.FCIH_MATURITY_DATE.slice(0, 10);
                                    $("#FCIH_START_DATE").val(FCIH_START_DATE);
                                    $("#FCIH_MATURITY_DATE").val(FCIH_MATURITY_DATE);
                                }
                                $("#INSUREREXIST_N").removeAttr("checked", true)
                                $("#INSUREREXIST_Y").attr("checked", true)
                                $(".ExistingLifePlans").removeAttr("hidden", true);
                                $("#FCIH_POLICY_NO").val(this.FCIH_POLICY_NO)
                                $("#FCIH_INSUREREXIST_ID").val(this.FCIH_INSUREREXIST_ID)
                                $("#FCIH_SA_AMOUNT").val(this.FCIH_SA_AMOUNT)
                                $("#FCIH_MATURITY_DATE").val(this.FCIH_MATURITY_DATE)
                                $("#FCIH_INSURER_PURPOSE").val(this.FCIH_INSURER_PURPOSE)
                                $("#FCIH_INSURER_NM").val(this.FCIH_INSURER_NM)
                                $("#FCIH_COND_ACCPTNCE").val(this.FCIH_COND_ACCPTNCE)
                            }
                        })
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
            $.ajax({
                "crossDomain": true,
                url: "" + Result_API + "/api/FinanceDtls/GetUserFinanceDtls/" + custcode,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + sessionPos
                },
                datatype: 'jsonp',
                success: function (result) {
                    $(result).each(function () {
                        $("#FCFA_FIN_ID").val(this.FCFA_FIN_ID);
                        $("#FCFA_ANNUAL_INCOME").val(this.FCFA_ANNUAL_INCOME);
                        $("#FCFA_OTHER_INCOME").val(this.FCFA_OTHER_INCOME);
                        $("#FCFA_TOTAL_INCOME").val(this.FCFA_TOTAL_INCOME);
                        $("#FCFA_CUST_EXPENSES").val(this.FCFA_CUST_EXPENSES);
                        $("#FCFA_EXPENSES_LASTYR").val(this.FCFA_EXPENSES_LASTYR);
                        $("#FCFA_EXPENSES_CURRENTYR").val(this.FCFA_EXPENSES_CURRENTYR);
                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
            $("#acceptAnalysis").attr("checked", true);
        }
        if (sessionStorage.getItem("DocCODE") == null && sessionStorage.getItem("cnic.") == null) {
            //    $("#videographyModal").modal("show")
        }

        if ((sessionStorage.getItem("token") == "" || sessionStorage.getItem("token") == "null") && localStorage.getItem("token2") != "" && sessionStorage.getItem("User") == null && sessionStorage.getItem("cnic.") != null) {
            sessionStorage.setItem("token", localStorage.getItem("token2"));
            $("#FCDM_OWCUST_CNIC").attr("readonly", true);
            $("#FCDM_OWCUST_CNIC").addClass("readonly");
            $("#FCDM_OWCUST_CNIC").val(sessionStorage.getItem("thisCustCNIC"))
            $("#SavedIllustText").removeAttr("hidden", true);
            $("#SavedIllustBtn").removeAttr("hidden", true);
            $("#processPlan").removeAttr("hidden", true);
            $("#servicesDropdown").removeAttr("hidden", true);
        }
        if ((sessionStorage.getItem("token") == "" || sessionStorage.getItem("token") == "null") && localStorage.getItem("token3") != "" && sessionStorage.getItem("User") == null && sessionStorage.getItem("cnic.") != null) {
            sessionStorage.setItem("token", localStorage.getItem("token3"));
            $("#FCDM_OWCUST_CNIC").attr("readonly", true);
            $("#FCDM_OWCUST_CNIC").addClass("readonly");
            $("#FCDM_OWCUST_CNIC").val(sessionStorage.getItem("thisCustCNIC"))
            $("#SavedIllustText").removeAttr("hidden", true);
            $("#SavedIllustBtn").removeAttr("hidden", true);
            $("#processPlan").removeAttr("hidden", true);
            $("#servicesDropdown").removeAttr("hidden", true);
        }

        if (sessionStorage.getItem("tokenIndex") != null && sessionStorage.getItem("tokenIndex") != "" && sessionStorage.getItem("tokenIndex") != "null") {
            $("#FCDM_OWCUST_CNIC").attr("readonly", true);
            $("#FCDM_OWCUST_CNIC").addClass("readonly");
            let sessionPos = getSessionpos();
            if (sessionStorage.getItem("cnic.") != null) {
                let cnic = sessionStorage.getItem("cnic.");
                checkCNICQuotations(cnic, "FCDM_OWCUST_CNIC");
                $("#SavedIllustText").removeAttr("hidden", true);
                $("#SavedIllustBtn").removeAttr("hidden", true);
                $.ajax({
                    "crossDomain": true,
                    url: "" + Result_API + "/api/TakafulHist/GetUserTakafulHistory/" + sessionStorage.getItem("cnic."),
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Origin': Result_API,
                        'Access-Control-Allow-Methods': 'POST, GET',
                        'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                        'Authorization': 'Bearer ' + sessionPos
                    },
                    datatype: 'jsonp',
                    success: function (result) {
                        if (result.length != 0) {
                            $(result).each(function () {
                                if (this.FCIH_INSUREREXIST_YN == "N") {
                                    $("#INSUREREXIST_N").attr("checked", true)
                                }
                                if (this.FCIH_INSUREREXIST_YN == "Y") {
                                    if (this.FCIH_START_DATE != null && this.FCIH_MATURITY_DATE != null) {
                                        let FCIH_START_DATE = this.FCIH_START_DATE.slice(0, 10);
                                        let FCIH_MATURITY_DATE = this.FCIH_MATURITY_DATE.slice(0, 10);
                                        $("#FCIH_START_DATE").val(FCIH_START_DATE);
                                        $("#FCIH_MATURITY_DATE").val(FCIH_MATURITY_DATE);
                                    }
                                    $("#INSUREREXIST_N").removeAttr("checked", true)
                                    $("#INSUREREXIST_YN").attr("checked", true)
                                    $(".ExistingLifePlans").removeAttr("hidden", true);
                                    $("#FCIH_POLICY_NO").val(this.FCIH_POLICY_NO)
                                    $("#FCIH_INSUREREXIST_ID").val(this.FCIH_INSUREREXIST_ID)
                                    $("#FCIH_SA_AMOUNT").val(this.FCIH_SA_AMOUNT)
                                    $("#FCIH_CONTRIB_AMT").val(this.FCIH_CONTRIB_AMT)
                                    $("#FCIH_INSURER_PURPOSE").val(this.FCIH_INSURER_PURPOSE)
                                    $("#FCIH_INSURER_NM").val(this.FCIH_INSURER_NM)
                                    $("#FCIH_COND_ACCPTNCE").val(this.FCIH_COND_ACCPTNCE)
                                }
                            })
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 401) {
                        }
                    }
                });
                $.ajax({
                    "crossDomain": true,
                    url: "" + Result_API + "/api/FinanceDtls/GetUserFinanceDtls/" + sessionStorage.getItem("cnic."),
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Origin': Result_API,
                        'Access-Control-Allow-Methods': 'POST, GET',
                        'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                        'Authorization': 'Bearer ' + sessionPos
                    },
                    datatype: 'jsonp',
                    success: function (result) {
                        $(result).each(function () {
                            $("#FCFA_FIN_ID").val(this.FCFA_FIN_ID);
                            $("#FCFA_ANNUAL_INCOME").val(this.FCFA_ANNUAL_INCOME);
                            $("#FCFA_OTHER_INCOME").val(this.FCFA_OTHER_INCOME);
                            $("#FCFA_TOTAL_INCOME").val(this.FCFA_TOTAL_INCOME);
                            $("#FCFA_CUST_EXPENSES").val(this.FCFA_CUST_EXPENSES);
                            $("#FCFA_EXPENSES_LASTYR").val(this.FCFA_EXPENSES_LASTYR);
                            $("#FCFA_EXPENSES_CURRENTYR").val(this.FCFA_EXPENSES_CURRENTYR);
                        })
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 401) {
                        }
                    }
                });
                $("#acceptAnalysis").attr("checked", true);
            }
            $("#processPlan").removeAttr("hidden", true);
            $("#reportPlan").removeAttr("hidden", true);
            $("#servicesDropdown").removeAttr("hidden", true);
        }

        if ($("#Annual_savings").is(':checked')) {
            $("#FCDM_PLAN_CONTRIB").removeAttr("readonly", true);
        }

        $(".sign_out").click(function () {
            window.location.href = "/";
            sessionStorage.clear();
            localStorage.clear();
        })
        $("#settings-trigger").attr("hidden", true);
        $(".sidebar-offcanvas").attr("hidden", true);

        let createdUser = sessionStorage.getItem("User");
        if (createdUser != null) {
            $("#SavedIllustText").removeAttr("hidden", true);
            $("#SavedIllustBtn").removeAttr("hidden", true);
            $("#mySavedIllustModal").modal("show");
            let count = 1;
            let cust_cnic = sessionStorage.getItem("DocCNIC");
            let sessionPos = getSessionpos();

            $.ajax({
                "crossDomain": true,
                type: "GET",
                url: "" + Result_API + "/api/Partcipant/GetParticipantAllGenDoc/" + cust_cnic,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + sessionPos
                },
                datatype: 'jsonp',
                timeout: 2000,
                success: function (data) {
                    if (data.length >= 1) {
                        $("#tableSavedillust tbody").empty();
                        if ($("#tableSavedillust tbody").length == 0) {
                            $("#tableSavedillust").append("<tbody></tbody>");
                        }
                        for (let i = 0; i <= data.length - 1; i++) {
                            $("#tableSavedillust tbody").append("<tr>" +
                                "<td hidden><input class='form-control' style='width:40px;' name='DOCUMENT_ID' id='DOCUMENT_ID" + count + "' value='" + data[i].DOCUMENT_ID + "'>" + data[i].DOCUMENT_ID + "</td>" +
                                "<td hidden><input class='form-control' style='width:40px;' name='DOCUMENT_CODE' id='DOCUMENT_CODE" + count + "' value='" + data[i].DOCUMENT_CODE + "'></td>" +
                                "<td><img src='/Assets/images/continue_btn.png' class='illustIcons' id='continueDoc" + count + "' onclick='continueThisDocument(this.id)'/></td>" +
                                "<td>" + data[i].DOCUMENT_CODE + "</td>" +
                                "<td>PKR " + nf.format(data[i].POL_COVGE_SUMASSURD) + "</td>" +
                                "<td>PKR " + nf.format(data[i].BASIC_CONTRIBUTION) + "</td>" +
                                "<td>" + data[i].MEMBERSHIP_TERM + "</td>" +
                                "<td><img src='/Assets/images/down-arrow.png' class='illustIcons' id='downloadDoc" + count + "' onclick='downloadThisDocument(this.id)'/></td>" +
                                "<td><img src='/Assets/images/edit_pencil.png' class='illustIcons' id='editDoc" + count + "' onclick='editThisDocument(this.id)'/></td>" +
                                "</tr>");
                            count += 1;
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
        }

        //------------------------VIEW SAVED ILLUSTRATIONS MODAL---------------------//
        $("#btnViewSavedIllustrations").click(function () {
            $("#mySavedIllustModal").modal("show");
            let count = 1;
            let cust_cnic = sessionStorage.getItem("DocCNIC");
            if (cust_cnic == null) {
                cust_cnic = sessionStorage.getItem("thisCustCNIC");
            }
            let sessionPos = getSessionpos();

            $.ajax({
                "crossDomain": true,
                type: "GET",
                url: "" + Result_API + "/api/Partcipant/GetParticipantAllGenDoc/" + cust_cnic,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + sessionPos
                },
                datatype: 'jsonp',
                timeout: 2000,
                success: function (data) {
                    if (data.length >= 1) {
                        $("#tableSavedillust tbody").empty();
                        if ($("#tableSavedillust tbody").length == 0) {
                            $("#tableSavedillust").append("<tbody></tbody>");
                        }
                        for (let i = 0; i <= data.length - 1; i++) {
                            $("#tableSavedillust tbody").append("<tr>" +
                                "<td hidden><input class='form-control' style='width:40px;' name='DOCUMENT_ID' id='DOCUMENT_ID" + count + "' value='" + data[i].DOCUMENT_ID + "'>" + data[i].DOCUMENT_ID + "</td>" +
                                "<td hidden><input class='form-control' style='width:40px;' name='DOCUMENT_CODE' id='DOCUMENT_CODE" + count + "' value='" + data[i].DOCUMENT_CODE + "'></td>" +
                                "<td><img src='/Assets/images/continue_btn.png' class='illustIcons' id='continueDoc" + count + "' onclick='continueThisDocument(this.id)'/></td>" +
                                "<td>" + data[i].DOCUMENT_CODE + "</td>" +
                                "<td>PKR " + nf.format(data[i].POL_COVGE_SUMASSURD) + "</td>" +
                                "<td>PKR " + nf.format(data[i].BASIC_CONTRIBUTION) + "</td>" +
                                "<td>" + data[i].MEMBERSHIP_TERM + "</td>" +
                                "<td><img src='/Assets/images/down-arrow.png' class='illustIcons' id='downloadDoc" + count + "' onclick='downloadThisDocument(this.id)'/></td>" +
                                "<td><img src='/Assets/images/edit_pencil.png' class='illustIcons' id='editDoc" + count + "' onclick='editThisDocument(this.id)'/></td>" +
                                "</tr>");
                            count += 1;
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
        })

        //----------------show verification otp modal and verify otp-----------------------//
        if ($("#SUM_SYS_USER_ID").val() != "") {
            let userID = $("#SUM_SYS_USER_ID").val();

            $.ajax({
                "crossDomain": true,
                url: "" + Result_API + "/api/PosUser/GetPOSUserDetails/" + userID,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + getsession
                },
                datatype: 'jsonp',
                success: function (result) {
                    $(result).each(function () {
                        let DigitCode = this.SUM_CUST_OTP;
                        let cust_name = this.SUM_FULL_NAME.split(" ")[0];
                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
                        $.ajax({
                            type: "POST",
                            url: "/User/SendSMS",
                            data: {
                                username: cust_name, Txtmessage: ", your OTP verification Code for SFTL application is " + DigitCode, phoneNumber: cust_number
                            }
                        }).done(function (msg) {
                        });
                        //show verify modal
                        $("#VerifyModal").modal("show");

                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });

            $("#firstDigit").keyup(function () {
                if ($(this).val() != "") {
                    $("#secondDigit").focus();
                }
            })
            $('#secondDigit').keyup(function (e) {
                if ($(this).val() != "") {
                    $("#thirdDigit").focus();
                }
            });
            $('#thirdDigit').keyup(function (e) {
                if ($(this).val() != "") {
                    $("#fourthDigit").focus();
                }
            });
            $('#fourthDigit').keyup(function (e) {
                if ($(this).val() != "") {
                    $("#fifthDigit").focus();
                }
            });
            $('#fifthDigit').keyup(function (e) {
                if ($(this).val() != "") {
                    $("#sixthDigit").focus();
                }
            });
        }
        //---------------------RESEND OTP------------------------//
        $("#resendCode").click(function (e) {
            let userId = $("#SUM_SYS_USER_ID").val();

            $.ajax({
                "crossDomain": true,
                url: "" + Result_API + "/api/PosUser/GetPOSUserDetails/" + userId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + getsession
                },
                datatype: 'jsonp',
                success: function (result) {
                    $(result).each(function () {
                        let DigitCode = this.SUM_CUST_OTP;
                        let cust_name = this.SUM_FULL_NAME.split(" ")[0];
                        let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
                        let customer_email = this.SUM_USER_EMAIL_ADDR;
                        $.ajax({
                            type: "POST",
                            url: "/User/SendSMS",
                            data: {
                                username: cust_name, Txtmessage: ", your OTP verification Code for SFTL application is " + DigitCode, phoneNumber: cust_number
                            }
                        }).done(function (msg) {
                        });
                        if (customer_email != null) {
                            $.ajax({
                                type: "POST",
                                url: "/User/SendEmail",
                                data: { username: cust_name, messageEmail: "<p>Your OTP verification Code for SFTL application is " + DigitCode + "</p>", emailAddress: customer_email, subject: "OTP" }
                            }).done(function (msg) {
                            });
                        }
                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
        })

        //---------------------DIGITS VERIFICATION---------------//
        if ($("#FSCU_CUSTOMER_CODE").val() != "") {
            let customer_code = $("#FSCU_CUSTOMER_CODE").val();
            localStorage.setItem("cust_code", customer_code);
            localStorage.getItem("cust_code")
        }
        $("#verifyOTP").click(function () {
            let digitsArray = [];
            let codeNumbersLi = document.getElementsByClassName("code-number")
            for (let i = 0; i < codeNumbersLi[0].children.length; i++) {
                digitsArray.push(codeNumbersLi[0].children[i].children[0].value)
            }
            let CodeDigits = digitsArray.join("");
            let PosUserID = $("#SUM_SYS_USER_ID").val();
            $(".continueAccSect").click(function () {
                $("#AccountSection").modal("hide");
                $("#mySavedIllustModal").modal("show");
            })
            if (digitsArray.length == 6) {
                $.ajax({
                    "crossDomain": true,
                    url: "" + Result_API + "/api/PosUser/GetPOSUserDetails/" + PosUserID,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Origin': Result_API,
                        'Access-Control-Allow-Methods': 'POST, GET',
                        'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                        'Authorization': 'Bearer ' + getsession
                    },
                    datatype: 'jsonp',
                    success: function (result) {
                        $(result).each(function () {
                            if (CodeDigits == this.SUM_CUST_OTP) {
                                $(".alert-otp").removeAttr("hidden", true);
                                sessionStorage.removeItem("GlobalPos");
                                window.setTimeout(function () {
                                    $(".alert-otp").attr("hidden", true);
                                    $("#VerifyModal").modal("hide");
                                    $("#AccountSection").modal("show");
                                    $("#SavedIllustText").removeAttr("hidden", true);
                                    $("#SavedIllustBtn").removeAttr("hidden", true);
                                }, 2500);
                                sessionStorage.setItem("User", PosUserID)
                                sessionStorage.getItem("User");
                                sessionStorage.setItem("User_", this.SUM_USER_PASSWORD);
                                sessionStorage.getItem("User_");
                                $("#AccountSection").addClass("AccountSection-bg")
                                let count = 1;
                                let cust_cnic = sessionStorage.getItem("DocCNIC");
                                $.ajax({
                                    "crossDomain": true,
                                    type: "GET",
                                    url: "" + Result_API + "/api/Partcipant/GetParticipantAllGenDoc/" + cust_cnic,
                                    contentType: "application/json; charset=utf-8",
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Access-Control-Allow-Origin': Result_API,
                                        'Access-Control-Allow-Methods': 'POST, GET',
                                        'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                                        'Authorization': 'Bearer ' + getsession
                                    },
                                    datatype: 'jsonp',
                                    timeout: 2000,
                                    success: function (data) {
                                        if (data.length >= 1) {
                                            $("#tableSavedillust tbody").empty();
                                            if ($("#tableSavedillust tbody").length == 0) {
                                                $("#tableSavedillust").append("<tbody></tbody>");
                                            }
                                            for (let i = 0; i <= data.length - 1; i++) {
                                                $("#tableSavedillust tbody").append("<tr>" +
                                                    "<td hidden><input class='form-control' style='width:40px;' name='DOCUMENT_ID' id='DOCUMENT_ID" + count + "' value='" + data[i].DOCUMENT_ID + "'>" + data[i].DOCUMENT_ID + "</td>" +
                                                    "<td hidden><input class='form-control' style='width:40px;' name='DOCUMENT_CODE' id='DOCUMENT_CODE" + count + "' value='" + data[i].DOCUMENT_CODE + "'></td>" +
                                                    "<td><img src='/Assets/images/continue_btn.png' class='illustIcons' id='continueDoc" + count + "' onclick='continueThisDocument(this.id)'/></td>" +
                                                    "<td>" + data[i].DOCUMENT_CODE + "</td>" +
                                                    "<td>PKR " + nf.format(data[i].POL_COVGE_SUMASSURD) + "</td>" +
                                                    "<td>PKR " + nf.format(data[i].BASIC_CONTRIBUTION) + "</td>" +
                                                    "<td>" + data[i].MEMBERSHIP_TERM + "</td>" +
                                                    "<td><img src='/Assets/images/down-arrow.png' class='illustIcons' id='downloadDoc" + count + "' onclick='downloadThisDocument(this.id)'/></td>" +
                                                    "<td><img src='/Assets/images/edit_pencil.png' class='illustIcons' id='editDoc" + count + "' onclick='editThisDocument(this.id)'/></td>" +
                                                    "</tr>");
                                                count += 1;
                                            }
                                        }
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        if (jqXHR.status === 401) {
                                        }
                                    }
                                });
                                let cust_number = (this.SUM_CUST_CONTPHONE).slice(1);
                                let custName = this.SUM_FULL_NAME.split(" ")[0];
                                $.ajax({
                                    type: "POST",
                                    url: "/User/DecryptString",
                                    data: {
                                        Text: this.SUM_USER_PASSWORD
                                    }
                                }).done(function (msg) {
                                    let resultText = msg;
                                    cust_cnic = cust_cnic.replaceAll("-", "");
                                    $.ajax({
                                        type: "POST",
                                        url: "/User/SendSMS",
                                        data: {
                                            username: custName, Txtmessage: ", we are pleased to inform you that your SFTL account has been created successfully. Your login ID for STFL Application is " + cust_cnic + " and your password is " + resultText + ". Sign in to see your policy information https://portals.salaamfamilytakaful.com", phoneNumber: cust_number
                                        }
                                    }).done(function (msg) {
                                    });
                                });
                            }
                            else {
                                $(".wrong-otp").removeAttr("hidden", true);
                                window.setTimeout(function () {
                                    $(".wrong-otp").attr("hidden", true);
                                }, 2500);
                            }
                        })
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 401) {
                        }
                    }
                });
            }
        })

        var code = "+92";
        $('#FCDM_OWCUST_MOBILENO').val(code);
        let contact_no = document.querySelector("#FCDM_OWCUST_MOBILENO");
        window.intlTelInput(contact_no);
        $(".iti--allow-dropdown").css("width", "100%")

        $(".closeOTPModal").click(function () {
            $("#VerifyModal").modal("hide");
        })
        $(".closeSavedIllust").click(function () {
            $("#mySavedIllustModal").modal("hide");
        });
        $(".closePlanIllust").click(function () {
            muteVideo();
            $("#videographyModal").modal("hide");
        });
        $(".closeAnalysisForm").click(function () {
            $("#needAnalysisModal").modal("hide");
        });
        $('#FCDM_OWCUST_CNIC').on('blur', function () {
            let inputString = $(this).val();
            if (!isValidInput(inputString)) {
                setTimeout(function () {
                    $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                        $(this).remove();
                    });
                }, 3000);
                $('#FCDM_OWCUST_CNIC').val("");
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please Enter correct CNIC Number</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
        });
        $("#btnProcessFlagship").click(function (e) {
            let cnicNumber = $("#FCDM_OWCUST_CNIC").val();
            checkUser = cnicNumber.replaceAll("-", "");
            let mobileNumber = $("#FCDM_OWCUST_MOBILENO").val();
            let dob = $("#FCDM_OWCUST_DOB").val();
            let cust_age = calculateAge(dob);
            let bmiVal = $("#FCDM_OWCUST_BMI").val();
            let firstName = $("#FCDM_OWCUST_FIRSTNAME").val();
            let gender = $("#FCDM_OW_GENDR_FSCD_ID").val();
            let occupation = $("#FCDM_OW_CUOCP_FSCD_ID").val();
            let takafulContrib = $("#FCDM_PLAN_CONTRIB").val();
            let covergeAmt = $("#FCDM_FACE_VALUE").val();
            let sessionPos = getSessionpos();
            setTimeout(function () {
                $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                    $(this).remove();
                });
            }, 3000);
            if (mobileNumber.length != 13) {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please Enter Mobile Number in +92 XXXXXXXXXX format</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (cust_age < 18 || cust_age > 65) {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Age range for our Takaful Membership is between 18 and 65</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (cnicNumber.length != 15) {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please Enter correct CNIC Number</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (firstName == "") {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please enter your first name</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (gender == "") {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please select your gender</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (occupation == "") {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please select your occupation</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (dob == "") {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please select your date of birth</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (bmiVal == 0 || bmiVal == null || bmiVal == undefined) {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please check your BMI</div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (takafulContrib == 0 || takafulContrib == null || takafulContrib == undefined) {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please enter valid takaful contribution </div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            if (covergeAmt == 0 || covergeAmt == null || covergeAmt == undefined) {
                $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please enter valid takaful contribution again </div></div></div>")
                $(window).scrollTop(0);
                return false;
            }
            else {
                let doccnic = sessionStorage.getItem("DocCNIC");
                if (sessionStorage.getItem("cnic.") == null && doccnic == null) {
                    $.ajax({
                        "crossDomain": true,
                        url: "" + Result_API + "/api/PosUser/GetUserByUserCd/" + checkUser,
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Access-Control-Allow-Origin': Result_API,
                            'Access-Control-Allow-Methods': 'POST, GET',
                            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                            'Authorization': 'Bearer ' + sessionPos
                        },
                        datatype: 'jsonp',
                        success: function (result) {
                            if (result.length == 1) {
                                $("#needAnalysisModal").modal("hide");
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Alert',
                                    text: 'Something went wrong! Your account already exists.\nPlease sign in',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        sessionStorage.clear();
                                        localStorage.clear();
                                        $.post("/User/removeSessionValue", function (token) {
                                            window.location.href = "/"
                                        });
                                    }
                                });
                                return false;
                            }
                            else {
                                return true;
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status === 401) {
                            }
                        }
                    });
                }
                if (sessionStorage.getItem("cnic.") != null) {
                    $.ajax({
                        "crossDomain": true,
                        url: "" + Result_API + "/api/FinanceNeeds/GetUserFinanceNeeds/" + sessionStorage.getItem("cnic."),
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Access-Control-Allow-Origin': Result_API,
                            'Access-Control-Allow-Methods': 'POST, GET',
                            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                            'Authorization': 'Bearer ' + sessionPos
                        },
                        datatype: JSON,
                        success: function (result) {
                            if (result.length > 1) {
                                for (let i = 0; i < result.length; i++) {
                                    $("#FCFN_FINQUEST_PRIORITYNO" + (i + 1)).val(Number(result[i].FCFN_FINQUEST_PRIORITYNO));
                                    $("#FCFN_FINQUEST_PRIORITYNO" + (i + 1)).attr("readonly", true);
                                }
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status === 401) {
                            }
                        }
                    });
                }
                if (doccnic != null) {
                    doccnic = doccnic.replaceAll("-", "")
                    $.ajax({
                        "crossDomain": true,
                        url: "" + Result_API + "/api/FinanceNeeds/GetUserFinanceNeeds/" + doccnic,
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Access-Control-Allow-Origin': Result_API,
                            'Access-Control-Allow-Methods': 'POST, GET',
                            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                            'Authorization': 'Bearer ' + sessionPos
                        },
                        datatype: JSON,
                        success: function (result) {
                            if (result.length > 1) {
                                for (let i = 0; i < result.length; i++) {
                                    $("#FCFN_FINQUEST_PRIORITYNO" + (i + 1)).val(Number(result[i].FCFN_FINQUEST_PRIORITYNO));
                                    $("#FCFN_FINQUEST_PRIORITYNO" + (i + 1)).attr("readonly", true);
                                }
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status === 401) {
                            }
                        }
                    });
                }
                $("#needAnalysisModal").modal("show");
            }
        })
        $(".closeRidersForm").click(function () {
            $("#RiderSection").modal("hide");
        })
    })
}()

function getSessionpos() {
    if (sessionStorage.getItem("GlobalPos") != null) {
        let sessionPos = sessionStorage.getItem("GlobalPos");
        return sessionPos;
    } if (sessionStorage.getItem("token") != '') {
        let sessionPos = sessionStorage.getItem("token");
        return sessionPos;
    }
    if (sessionStorage.getItem("tokenIndex") != null) {
        let sessionPos = sessionStorage.getItem("tokenIndex");
        return sessionPos;
    }
}
function fillCustomerInfo(CNIC, session) {
    let sessionPos = '';
    //$(".biodata").attr("hidden", true);
    //$(".gendetails").attr("hidden", true);
    //$(".healthdetails").attr("hidden", true);
    if (sessionStorage.getItem("GlobalPos") != null) {
        sessionPos = sessionStorage.getItem("GlobalPos");
    } if (sessionStorage.getItem("token") != '') {
        sessionPos = sessionStorage.getItem("token");
    }
    if (sessionStorage.getItem("tokenIndex") != null) {
        sessionPos = sessionStorage.getItem("tokenIndex");
    }
    $.ajax({
        "crossDomain": true,
        type: "GET",
        url: "" + Global_API + "/API/CUSTOMER/SEARCH_CUSTOMER/" + CNIC,
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + sessionPos
        },
        datatype: 'jsonp',
        timeout: 2000,
        success: function (data) {
            $("#CUOCP_FSCD_ID").removeAttr("required", true);
            if (data.length == 1) {
                $(data).each(function () {
                    let DATEOFBIRTH = (this.FSCU_DATEOFBIRTH).slice(0, 10);
                    $("#FCDM_OWCUST_FIRSTNAME").val(this.FSCU_FIRST_NAME);
                    $("#FCDM_OWCUST_MDDLNAME").val(this.FSCU_MIDDLE_NAME);
                    $("#FCDM_OWCUST_LASTNAME").val(this.FSCU_LAST_NAME);
                    $("#FCDM_OW_GENDR_FSCD_ID").val(this.FSCU_GENDR_FSCD_DID);
                    $("#FCDM_OWCUST_DOB").val(DATEOFBIRTH);
                    $("#FCDM_OWCUST_HEITACT").val(this.FSCU_CUST_HEIGHT);
                    $("#FCDM_OWCUST_WEITACT").val(this.FSCU_CUST_WEIGHT);
                    $("#FCDM_OWCUST_BMI").val(this.FSCU_CUST_BMI);
                    $("#FCDM_OW_CUOCP_FSCD_ID").val(this.FSCU_CUOCP_FSCD_DID);
                })
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
    $.ajax({
        "crossDomain": true,
        url: "" + Result_API + "/api/Partcipant/GetParticipantAllGenDoc/" + CNIC,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Result_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + sessionPos
        },
        datatype: 'jsonp',
        success: function (result) {
            if (result.length >= 1) {
                $("#FCDM_OWCUST_MOBILENO").val(result[0].FCDM_OWCUST_MOBILENO);
                $("#FCDM_OWCUST_EMAILADDR").val(result[0].FCDM_OWCUST_EMAILADDR);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
}

function getFinancialQues(session) {
    $.ajax({
        "crossDomain": true,
        url: "" + Result_API + "/api/FinanceNeeds/GetAllFinancialQuestions",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Result_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + session
        },
        datatype: 'jsonp',
        success: function (result) {
            $("#financial_security").empty();
            $("#financial_needs").empty();
            for (let i = 0; i < result.length; i++) {
                if (result[i].FSFP_FINQUEST_TYPE == 1) {
                    $("#financial_security").append("<div class='row p-2'>" +
                        "<div class='col-md-9'>" + result[i].FSFP_FINQUEST_DESCRP +
                        "<input class='form-control' name='FSFP_FINQUEST_FSCD_ID' id='FSFP_FINQUEST_FSCD_ID" + result[i].FSFP_OBJ_ID + "' value='" + result[i].FSFP_FINQUEST_FSCD_ID + "' required hidden />" +
                        "<input class='form-control' name='FSFP_FINQUEST_TYPE' id='FSFP_FINQUEST_TYPE" + result[i].FSFP_OBJ_ID + "' value='" + result[i].FSFP_FINQUEST_TYPE + "' required hidden />" +
                        "</div>" +
                        "<div class='col-md-3'>" +
                        "<input class='form-control FINQUEST_TYPE1' name='FCFN_FINQUEST_PRIORITYNO' id='FCFN_FINQUEST_PRIORITYNO" + result[i].FSFP_OBJ_ID + "' type='number' min='1' max='7' value='" + result[i].FSFP_OBJ_ID + "' required />" +
                        "</div>" +
                        "</div>"
                    )
                }
                if (result[i].FSFP_FINQUEST_TYPE == 2) {
                    let prorityNo = (result[i].FSFP_OBJ_ID).toString().slice(1);
                    $("#financial_needs").append("<div class='row p-2'>" +
                        "<div class='col-md-9'>" + result[i].FSFP_FINQUEST_DESCRP +
                        "<input class='form-control' name='FSFP_FINQUEST_FSCD_ID' id='FSFP_FINQUEST_FSCD_ID" + result[i].FSFP_OBJ_ID + "' value='" + result[i].FSFP_FINQUEST_FSCD_ID + "' required hidden />" +
                        "<input class='form-control' name='FSFP_FINQUEST_TYPE' id='FSFP_FINQUEST_TYPE" + result[i].FSFP_OBJ_ID + "' value='" + result[i].FSFP_FINQUEST_TYPE + "' required hidden />" +
                        "</div>" +
                        "<div class='col-md-3'>" +
                        "<input class='form-control FINQUEST_TYPE2' name='FCFN_FINQUEST_PRIORITYNO' id='FCFN_FINQUEST_PRIORITYNO" + result[i].FSFP_OBJ_ID + "' type='number' min='1' max='7' value='" + prorityNo + "' required />" +
                        "</div>" +
                        "</div>"
                    )
                }
            };
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
}
function muteVideo() {
    $('.savings-illustration')[0].muted = true;
    $('.savings-illustration')[1].muted = true;
}
function calculateAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
function checkValue(val) {
    if (val == 'A') {
        $("#FCDM_PLAN_CONTRIB").removeAttr("readonly", true);
        $("#FCDM_FACE_VALUE").val("");
        $("#FCDM_FACE_VALUE").attr("readonly", true);
    }
    else {
        $("#FCDM_FACE_VALUE").removeAttr("readonly", true)
        $("#FCDM_PLAN_CONTRIB").val("");
        $("#FCDM_PLAN_CONTRIB").attr("readonly", true);
    }
}
async function calculateFaceValue() {
    let sessionPos = getSessionpos()
    let annual_savings = $("#FCDM_PLAN_CONTRIB").val();
    let contrib_frequency = $("#FCDM_PFREQ_FSCD_ID").val();
    let cover_multiple_standard = $("#FCDM_PLAN_CASE_STATUS").val();
    let cover_multiple = $("#FCDM_COVER_MULTIPLE").val();
    let membership_term = $("#FCDM_PAYING_TERM").val();
    if (
        annual_savings != "" &&
        contrib_frequency != "" &&
        cover_multiple != "" &&
        membership_term != "" &&
        cover_multiple_standard != ""
    ) {
        try {
            let result = await $.ajax({
                crossDomain: true,
                url:
                    Result_API +
                    "/api/BasicInfo/GetFaceValue/" +
                    annual_savings +
                    "/" +
                    contrib_frequency +
                    "/" +
                    cover_multiple_standard +
                    "/" +
                    cover_multiple +
                    "/" +
                    membership_term,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Access-Control-Allow-Origin": Result_API,
                    "Access-Control-Allow-Methods": "POST, GET",
                    "Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
                    Authorization: "Bearer " + sessionPos,
                },
                datatype: "jsonp",
            });

            $(result).each(function () {
                $("#FCDM_FACE_VALUE").val(this.V_FACE_VALUE);
            });
        } catch (jqXHR) {
            if (jqXHR.status === 401) {
            }
        }
    }
}
function setCNICFormat(custCNIC, ID) {
    if (custCNIC[5] == "-" && custCNIC[13] == "-") {
        console.log("contains");
    }
    if (custCNIC.length == 13 && custCNIC[5] != "-" && custCNIC[13] != "-") {
        let n1 = custCNIC.substring(0, 5);
        let n2 = custCNIC.substring(5, 12);
        let addn = n1 + "-" + n2 + "-" + custCNIC[custCNIC.length - 1]
        $("#" + ID).val(addn);
        return addn;
    }
    if (custCNIC.length != 13 && custCNIC[5] != "-" && custCNIC[13] != "-") {
        $("#" + ID).val("");
    }
    if (custCNIC[5] == "-" || custCNIC[13] == "-") {
        custCNIC = custCNIC.replaceAll("-", "");
        let n1 = custCNIC.substring(0, 5);
        let n2 = custCNIC.substring(5, 12);
        let addn = n1 + "-" + n2 + "-" + custCNIC[custCNIC.length - 1]
        $("#" + ID).val(addn);
        return addn;
    }
    if (!isValidInput(inputString)) {
        setTimeout(function () {
            $(".validation-alert").fadeTo(500, 0).slideUp(500, function () {
                $(this).remove();
            });
        }, 3000);
        $('#FCDM_OWCUST_CNIC').val("");
        $(".flex-div").after("<div class='row validation-alert mt-3 mb-3'><div class='col-md-3 pb-5'><div class='alert alert-danger alert-dismissible fade show p-3 mt-2' role='alert'>Please Enter correct CNIC Number</div></div></div>")
        $(window).scrollTop(0);
        return false;
    }

}
function isValidInput(inputString) {
    var regex = /^\d{5}-\d{7}-\d$/;
    return regex.test(inputString);
}
function checkCNICQuotations(Val, ID2) {
    let sessionPos = getSessionpos()
    if (Val.length == 15 && Val[5] == "-" && Val[13] == "-") {
        sessionStorage.setItem("thisCustCNIC", Val);
        sessionStorage.getItem("thisCustCNIC");
    }
    else {
        let thisCustCNIC = setCNICFormat(Val, ID2);
        sessionStorage.setItem("thisCustCNIC", thisCustCNIC);
        sessionStorage.getItem("thisCustCNIC");
        Val = thisCustCNIC;
    }
    let count = 1;
    if (sessionStorage.getItem("User") == null) {
        $.ajax({
            "crossDomain": true,
            type: "GET",
            url: "" + Result_API + "/api/Partcipant/GetParticipantAllGenDoc/" + Val,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': Result_API,
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                'Authorization': 'Bearer ' + sessionPos
            },
            datatype: 'jsonp',
            timeout: 2000,
            success: function (data) {
                let nf = new Intl.NumberFormat('en-US');

                if (data.length >= 1) {
                    $("#mySavedIllustModal").modal("show");
                    $("#tableSavedillust tbody").empty();
                    if ($("#tableSavedillust tbody").length == 0) {
                        $("#tableSavedillust").append("<tbody></tbody>");
                    }
                    for (let i = 0; i <= data.length - 1; i++) {
                        $("#tableSavedillust tbody").append("<tr>" +
                            "<td hidden><input class='form-control' style='width:40px;' name='DOCUMENT_ID' id='DOCUMENT_ID" + count + "' value='" + data[i].DOCUMENT_ID + "'>" + data[i].DOCUMENT_ID + "</td>" +
                            "<td hidden><input class='form-control' style='width:40px;' name='DOCUMENT_CODE' id='DOCUMENT_CODE" + count + "' value='" + data[i].DOCUMENT_CODE + "'></td>" +
                            "<td><img src='/Assets/images/continue_btn.png' class='illustIcons' id='continueDoc" + count + "' onclick='continueThisDocument(this.id)'/></td>" +
                            "<td>" + data[i].DOCUMENT_CODE + "</td>" +
                            "<td>PKR " + nf.format(data[i].POL_COVGE_SUMASSURD) + "</td>" +
                            "<td>PKR " + nf.format(data[i].BASIC_CONTRIBUTION) + "</td>" +
                            "<td>" + data[i].MEMBERSHIP_TERM + "</td>" +
                            "<td><img src='/Assets/images/down-arrow.png' class='illustIcons' id='downloadDoc" + count + "' onclick='downloadThisDocument(this.id)'/></td>" +
                            "<td><img src='/Assets/images/edit_pencil.png' class='illustIcons' id='editDoc" + count + "' onclick='editThisDocument(this.id)'/></td>" +
                            "</tr>");
                        count += 1;
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                }
            }
        });
    }
}
function selectHeightFeet(Val) {
    let heightInches = $("#heightIn").val();
    if (heightInches != "") {
        if (heightInches == 1) {
            $("#heightResult").val(Val + " Feet " + heightInches + " Inch");
            $("#FCDM_OWCUST_HEITACT").val(Val + "." + heightInches);
            calculate_BMI();
        }
        else {
            $("#heightResult").val(Val + " Feet " + heightInches + " Inches");
            $("#FCDM_OWCUST_HEITACT").val(Val + "." + heightInches);
            calculate_BMI();
        }
    }
    else {
        $("#heightResult").val(Val + " Feet");
        $("#FCDM_OWCUST_HEITACT").val(Val + "." + heightInches);
        calculate_BMI();
    }
}
function selectHeightInches(Val) {
    $("#heightResult").val("");
    let heightInFt = $("#heightFt").val();
    if (heightInFt != "") {
        if ($("#heightIn").val() == 1) {
            $("#heightResult").val(heightInFt + " Feet " + Val + " Inch");
            $("#FCDM_OWCUST_HEITACT").val(heightInFt + "." + Val);
            calculate_BMI();
        }
        else {
            $("#heightResult").val(heightInFt + " Feet " + Val + " Inches");
            $("#FCDM_OWCUST_HEITACT").val(heightInFt + "." + Val);
            calculate_BMI();
        }
    }
}
function setHeightMaxLength(Val) {
    $("#FCDM_OWCUST_HEITACT").attr("hidden", true);
    $("#heightFt").removeAttr("hidden", true)
    $("#heightIn").removeAttr("hidden", true)
    $("#heightFt").addClass("w-50")
    $("#heightIn").addClass("w-50")

    $("#heightResult").removeAttr("hidden", true)
    let heightFeet = $("#heightFt").val();
    let heightInch = $("#heightIn").val();
    $("#heightResult").val(heightFeet + " Feet " + heightInch + " Inches");
    $("#FCDM_OWCUST_HEITACT").val(heightFeet + "." + heightInch);
    calculate_BMI();
}
function setHeightDescp(Val) {
    if (Val[1] == ".") {
        $("#heightResult").val(Val + " Inches");
    }
    else {
        $("#heightResult").val(Val + " Feet");
    }
}
//---------------------------BMI CALCULATION-------------------------------//
function calculate_BMI() {
    let heightComplete = $("#FCDM_OWCUST_HEITACT").val();
    let DDL_height = 20;
    let cust_weight = $("#FCDM_OWCUST_WEITACT").val();
    let DDL_weight = 23;
    if ($("#FCDM_OWCUST_HEITACT").val() != "" && $("#FCDM_OWCUST_WEITACT").val() != "") {
        if (cust_weight > 0 && heightComplete > 0 || heightComplete[1] == ".") {
            let heightFoot = heightComplete.substring(0, 1);
            let HeightInch = heightComplete.substring(2);
            if (HeightInch == "") {
                HeightInch = 0;
            }
            // BMI WITH FEET & inches AND KG
            if (DDL_height == '20' && DDL_weight == '23') {
                heightFoot = heightFoot * 0.3048; // from feet to meters
                HeightInch = HeightInch * 0.0254; // from inches to meters
                let height = heightFoot + HeightInch;
                var calculated_bmi = (cust_weight / (height * height)).toFixed(2);
                if (calculated_bmi.includes(".")) {
                    let i = calculated_bmi.indexOf(".");
                    if (Number(calculated_bmi[i + 1]) >= 5) {
                        calculated_bmi = Number(calculated_bmi.slice(0, i)) + 1;
                        $("#FCDM_OWCUST_BMI").val(calculated_bmi);
                        if (calculated_bmi < 18) {
                            $("#bmi_unhealthy").removeAttr("hidden", true)
                            $("#bmi_healthy").attr("hidden", true)
                            $("#bmi_obesity").attr("hidden", true)
                            $("#bmi_serious").attr("hidden", true)
                        }
                        if (calculated_bmi >= 18 && calculated_bmi <= 30) {
                            $("#bmi_healthy").removeAttr("hidden", true)
                            $("#bmi_unhealthy").attr("hidden", true)
                            $("#bmi_obesity").attr("hidden", true)
                            $("#bmi_serious").attr("hidden", true)
                        }
                        if (calculated_bmi >= 31) {
                            $("#bmi_obesity").removeAttr("hidden", true)
                            $("#bmi_unhealthy").attr("hidden", true)
                            $("#bmi_healthy").attr("hidden", true)
                            $("#bmi_serious").attr("hidden", true)
                        }
                    }
                    if (Number(calculated_bmi[i + 1]) < 5) {
                        calculated_bmi = calculated_bmi.slice(0, i);
                        $("#FCDM_OWCUST_BMI").val(calculated_bmi);
                        if (calculated_bmi < 18) {
                            $("#bmi_unhealthy").removeAttr("hidden", true)
                            $("#bmi_healthy").attr("hidden", true)
                            $("#bmi_obesity").attr("hidden", true)
                            $("#bmi_serious").attr("hidden", true)
                        }
                        if (calculated_bmi >= 18 && calculated_bmi <= 30) {
                            $("#bmi_healthy").removeAttr("hidden", true)
                            $("#bmi_unhealthy").attr("hidden", true)
                            $("#bmi_obesity").attr("hidden", true)
                            $("#bmi_serious").attr("hidden", true)
                        }
                        if (calculated_bmi >= 31) {
                            $("#bmi_obesity").removeAttr("hidden", true)
                            $("#bmi_unhealthy").attr("hidden", true)
                            $("#bmi_healthy").attr("hidden", true)
                            $("#bmi_serious").attr("hidden", true)
                        }
                    }
                }
                else {
                    if (calculated_bmi < 18) {
                        $("#bmi_unhealthy").removeAttr("hidden", true)
                        $("#bmi_healthy").attr("hidden", true)
                        $("#bmi_obesity").attr("hidden", true)
                        $("#bmi_serious").attr("hidden", true)
                    }
                    if (calculated_bmi >= 18 && calculated_bmi <= 30) {
                        $("#bmi_healthy").removeAttr("hidden", true)
                        $("#bmi_unhealthy").attr("hidden", true)
                        $("#bmi_obesity").attr("hidden", true)
                        $("#bmi_serious").attr("hidden", true)
                    }
                    if (calculated_bmi >= 31) {
                        $("#bmi_obesity").removeAttr("hidden", true)
                        $("#bmi_unhealthy").attr("hidden", true)
                        $("#bmi_healthy").attr("hidden", true)
                        $("#bmi_serious").attr("hidden", true)
                    }
                    $("#FCDM_OWCUST_BMI").val(calculated_bmi);
                }
            }
        }
    }
}
function continueThisDocument(ID) {
    ID = ID.slice(11);
    let thisDocID = $("#DOCUMENT_ID" + ID).val();
    let custDoc = 'DOC' + thisDocID;
    let sessionPos = getSessionpos()
    $.ajax({
        "crossDomain": true,
        url: "" + Result_API + "/api/Inquiry/GetDocInquiry/" + custDoc,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Result_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + sessionPos
        },
        datatype: 'jsonp',
        success: function (result) {
            if (result.length != 0) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].FPDM_POLDOC_REFNO == custDoc && result[i].FPDM_POLICY_NO != null) {
                        $("#" + ID).attr("disabled", true);
                        $("#" + ID).removeClass("illustIcons", true);
                        Swal.fire({
                            icon: 'info',
                            title: 'Alert',
                            text: 'You have already issued Policy on this document!',
                        })
                    }
                    else {
                        sessionStorage.setItem("thisDocID", thisDocID);
                        sessionStorage.getItem("thisDocID");
                        $("#mySavedIllustModal").modal("hide");
                        window.location.href = '/Basic_information';
                    }
                }
            }
            else {
                sessionStorage.setItem("thisDocID", thisDocID);
                sessionStorage.getItem("thisDocID");
                $("#mySavedIllustModal").modal("hide");
                window.location.href = '/Basic_information';
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
}
function editThisDocument(ID) {
    ID = ID.slice(7);
    let thisDocumentCode = $("#DOCUMENT_CODE" + ID).val();
    $("#mySavedIllustModal").modal("hide");
    let sessionPos = getSessionpos()
    $.ajax({
        "crossDomain": true,
        url: "" + Result_API + "/api/Partcipant/GetParticipantDetails/" + thisDocumentCode,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Result_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + sessionPos
        },
        datatype: 'jsonp',
        cache: false,
        success: function (result) {
            $(result).each(function () {
                sessionStorage.setItem("thisDocumentDode", this.DOCUMENT_CODE);
                sessionStorage.getItem("thisDocumentDode");
                let custDOB = (this.DOB).slice(0, 10);
                $("#FCDM_DOCUMENT_ID").val(this.DOCUMENT_ID);
                $("#FCDM_DOCUMENT_CODE").val(this.DOCUMENT_CODE);
                $("#FCDM_OWCUST_FIRSTNAME").val(this.PARTICIPANT_NAME);
                $("#FCDM_OWCUST_MDDLNAME").val(this.PARTICIPANT_MDDLNAME);
                $("#FCDM_OWCUST_LASTNAME").val(this.PARTICIPANT_LASTNAME);
                $("#FCDM_OWCUST_CNIC").val(this.FCDM_OWCUST_CNIC);
                $("#FCDM_OW_GENDR_FSCD_ID").val(this.GENDER);
                $("#FCDM_OWCUST_DOB").val(custDOB);
                $("#FCDM_PFREQ_FSCD_ID").val(this.CONTRIBUTION_FREQENCY);
                $("#FCDM_OW_CUOCP_FSCD_ID").val(this.FCDM_OW_CUOCP_FSCD_ID);
                $("#FCDM_OWCUST_MOBILENO").val(this.FCDM_OWCUST_MOBILENO);
                $("#FCDM_OWCUST_EMAILADDR").val(this.FCDM_OWCUST_EMAILADDR);
                $("#FCDM_OWCUST_HEITUNT").val(this.FCDM_OWCUST_HEITUNT);
                $("#FCDM_OWCUST_HEITACT").val(this.FCDM_OWCUST_HEITACT);
                $("#FCDM_OWCUST_WEITACT").val(this.FCDM_OWCUST_WEITACT);
                $("#FCDM_OWCUST_WEITUNT").val(this.FCDM_OWCUST_WEITUNT);
                $("#FCDM_OWCUST_BMI").val(this.FCDM_OWCUST_BMI);
                $("#FCDM_PAYING_TERM").val(this.MEMBERSHIP_TERM);
                $("#FCDM_PLAN_CONTRIB").val(this.BASIC_CONTRIBUTION);
                $("#FCDM_FACE_VALUE").val(this.POL_COVGE_SUMASSURD);
                $("#FSAG_AGENT_CODE").val(this.FSAG_AGENT_CODE);
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
    $.ajax({
        "crossDomain": true,
        url: "" + Result_API + "/api/DcmntQuestnr/GetDcmntQuestnrDetails/" + (thisDocumentCode).slice(3),
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Result_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + sessionPos
        },
        datatype: 'jsonp',
        cache: false,
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                $("#FCUQ_ANSR_YN" + (i + 1)).val(result[i].FCUQ_ANSR_YN);
                if (result[i].FCUQ_ANSR_YN == "Y") {
                    $("#FSPQS_PRODQESTNR_ID_Y" + (i + 1)).attr("checked", true);
                }
                if (result[i].FCUQ_ANSR_YN == "N") {
                    $("#FSPQS_PRODQESTNR_ID_N" + (i + 1)).attr("checked", true);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
}
function DeleteTblRecord(elem) {
    $(elem).closest('tr').remove();
}
function ReturnQuestVal(ID, Val) {
    ID = ID.slice(21)
    $("#FCUQ_ANSR_YN" + ID).val(Val);
}
function ExistInsValYes(ID, VAL) {
    $(".ExistingLifePlans").removeAttr("hidden", true);
    $("#FCIH_POLICY_NO").attr("required", true);
    $("#FCIH_SA_AMOUNT").attr("required", true);
    $("#FCIH_CONTRIB_AMT").attr("required", true);
    $("#FCIH_START_DATE").attr("required", true);
    $("#FCIH_MATURITY_DATE").attr("required", true);
    $("#FCIH_INSURER_PURPOSE").attr("required", true);
    $("#FCIH_INSURER_NM").attr("required", true);
    $("#FCIH_COND_ACCPTNCE").attr("required", true);
}
function ExistInsValNo(ID, VAL) {
    $(".ExistingLifePlans").attr("hidden", true);
    $("#FCIH_POLICY_NO").removeAttr("required", true);
    $("#FCIH_SA_AMOUNT").removeAttr("required", true);
    $("#FCIH_CONTRIB_AMT").removeAttr("required", true);
    $("#FCIH_START_DATE").removeAttr("required", true);
    $("#FCIH_MATURITY_DATE").removeAttr("required", true);
    $("#FCIH_INSURER_PURPOSE").removeAttr("required", true);
    $("#FCIH_INSURER_NM").removeAttr("required", true);
    $("#FCIH_COND_ACCPTNCE").removeAttr("required", true);
}
function calcTotalIncome(VAL) {
    let annualIncome = $("#FCFA_ANNUAL_INCOME").val();
    let otherIncome = $("#FCFA_OTHER_INCOME").val();
    $("#FCFA_TOTAL_INCOME").val(Number(annualIncome) + Number(otherIncome));
}
function DiseaseAnalysis(QuesID) {
    QuesID = QuesID.slice(21);
    let sessionPos = getSessionpos()
    if ($("#FSPQS_QSTNR_FSCD_ID" + QuesID).val() == "3541") {
        $("#medicalUnderWT").modal("show");
        $(".viewAllDisorders").click(function () {
            $(".seeLessDisorders").removeAttr("hidden", true);
            $(".allDisorders").removeAttr("hidden", true);
        })
        $(".seeLessDisorders").click(function () {
            $(".seeLessDisorders").attr("hidden", true);
            $(".allDisorders").attr("hidden", true);
        })
        $(".closeDiseaseForm").click(function () {
            $("#medicalUnderWT").modal("hide");
        })
        let doc_code = sessionStorage.getItem("thisDocumentDode").slice(3);
        if (doc_code != null) {
            $.ajax({
                "crossDomain": true,
                url: "" + Result_API + "/api/DcmntQuestnr/GetDocmntDiseases/" + doc_code,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + sessionPos
                },
                datatype: 'jsonp',
                success: function (result) {
                    $(result).each(function () {
                        if (this.FSDI_DISEASE_ID == 3) {
                            $("#FSDI_DISEASE_ID3").attr("checked", true);
                            $(".diseaseDetailsSec").removeAttr("hidden", true);
                            $("#FCDS_DISEASE_DETAILS1").val(this.FCDS_DISEASE_DETAILS);
                            let duration = this.FCDS_DISEASE_DURATION;
                            $('input[name=FCDS_DISEASE_DURATION][value=' + duration + ']').attr("checked", true);
                        }
                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
        }
    }
    if ($("#FSPQS_QSTNR_FSCD_ID" + QuesID).val() == "3542") {
        $("#medicalUnderWT2").modal("show");
        $(".closeDiseaseForm2").click(function () {
            $("#medicalUnderWT2").modal("hide");
        })
        let doc_code = sessionStorage.getItem("thisDocumentDode").slice(3);
        if (doc_code != null) {
            $.ajax({
                "crossDomain": true,
                url: "" + Result_API + "/api/DcmntQuestnr/GetDocmntDiseases/" + doc_code,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': Result_API,
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
                    'Authorization': 'Bearer ' + sessionPos
                },
                datatype: 'jsonp',
                success: function (result) {
                    $(result).each(function () {
                        if (this.FSDI_DISEASE_ID == 27) {
                            $("#FSDI_DISEASE_ID27").attr("checked", true);
                            $("#FCDS_DISEASE_DETAILS2").val(this.FCDS_DISEASE_DETAILS);
                        }
                    })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                    }
                }
            });
        }
    }
    if ($("#FSPQS_QSTNR_FSCD_ID" + QuesID).val() == "3543") {
        $("#INSUREREXIST_YN").attr("checked", true);
        $(".ExistingLifePlans").removeAttr("hidden", true);
    }
}
function setAgentName(AgentCode) {
    let sessionPos = getSessionpos()
    $.ajax({
        "crossDomain": true,
        url: "" + Global_API + "/api/Agent/GetAgentDetails/" + AgentCode,
        type: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': Global_API,
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
            'Authorization': 'Bearer ' + sessionPos
        },
        datatype: 'jsonp',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.length == 1) {
                $(result).each(function () {
                    $("#AGENT_NAME").val(this.FSAG_AGENT_NAME);
                });
            }
            else {
                $("#AGENT_NAME").val("");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
            }
        }
    });
}
function showDisease(elem, DisID) {
    let diseaseName = elem.nextElementSibling.innerText;
    let diseaseArray = [];
    if (DisID <= 26) {
        if ($('#tblMedDiseases tbody tr').length == 0) {
            MedDiseasesUniqueAdd(DisID, diseaseName)
        }
        else {
            $('#tblMedDiseases tbody tr').each(function (index, row) {
                diseaseArray.push(row.children[0].children[0].id);
            });
            if (diseaseArray.includes('DiseaseID' + DisID)) {
            } else {
                MedDiseasesUniqueAdd(DisID, diseaseName)
            }
        }
    }
    if (DisID >= 27) {
        if ($('#tblMedCatgry tbody tr').length == 0) {
            MedCatgryUniqueAdd(DisID, diseaseName)
        }
        else {
            $('#tblMedCatgry tbody tr').each(function (index, row) {
                diseaseArray.push(row.children[0].children[0].id);
            });
            if (diseaseArray.includes('DiseaseID' + DisID)) {
            } else {
                MedCatgryUniqueAdd(DisID, diseaseName)
            }
        }
    }
}
function checkRider(RdrYN) {
    if (RdrYN == "1") {
        $("#RiderSection").modal("show");
    }
    if (RdrYN == "0") {
        $("#tableRiders tbody").empty();
    }
}
function AddRdr(elem, ID) {
    let rdrName = elem.innerText;
    ID = ID.slice(8);
    let rdrsArray = [];
    if ($('#rdrInput' + ID).attr('checked')) {
        $(elem).removeClass("bg-info");
        $("#rdrInput" + ID).removeAttr("checked", true);
    } else {
        $("#rdrInput" + ID).attr("checked", true);
        $(elem).addClass("bg-info");
        if ($('#tableRiders tbody tr').length == 0) {
            RidersUniqueAdd(ID, rdrName)
        }
        else {
            $('#tableRiders tbody tr').each(function (index, row) {
                rdrsArray.push(row.children[0].children[0].id);
            });
            if (rdrsArray.includes('FCDR_DOC_RDR_ID' + ID)) {
            } else {
                RidersUniqueAdd(ID, rdrName)
            }
        }
    }
}
function RidersUniqueAdd(ID, name) {
    $("#tableRiders tbody").append("<tr><td hidden><input class='form-control' name='FCDR_DOC_RDR_ID' id='FCDR_DOC_RDR_ID" + ID + "' value='0' /></td>" +
        "<td hidden><input class='form-control' name='FSPM_PRODRDR_ID' id='FSPM_PRODRDR_ID" + ID + "' value='" + ID + "' /></td>" +
        "<td><input style='width:315px' class='form-control readonly' name='RDR_NAME' id='RDR_NAME" + ID + "' value='" + name + "' readonly /></td>" +
        "<td><input style='width:119px' class='form-control' name='FCDR_PAYING_TERM' id='FCDR_PAYING_TERM" + ID + "' placeholder='5 years' type='number' /></td>" +
        "<td><input style='width:150px' class='form-control' name='FCDR_FACE_VALUE' id='FCDR_FACE_VALUE" + ID + "' placeholder='100,000' type='number' /></td>" +
        "<td><img src='/Assets/images/delete-btn.png' class='delete-btn' onclick='DeleteTblRecord(this)' /></td></tr>"
    )
}
function MedDiseasesUniqueAdd(ID, name) {
    $("#tblMedDiseases tbody").append("<tr><td hidden><input class='form-control' name='DiseaseID' id='DiseaseID" + ID + "' value='" + ID + "' /></td>" +
        "<td><input style='width:200px' class='form-control readonly' name='DISEAESE_NAME' id='DISEAESE_NAME" + ID + "' value='" + name + "' readonly /></td>" +
        "<td><select style='width:119px' class='form-control' name='FCDS_DISEASE_DURATION' id='FCDS_DISEASE_DURATION" + ID + "'><option value=''>Select</option><option value='1'>Less than an year</option><option value='3'>1-5 years</option><option value='5'>Above 5 yearsr</option></select></td>" +
        "<td><input style='width:150px' class='form-control' name='FCDS_DISEASE_DETAILS' id='FCDS_DISEASE_DETAILS" + ID + "' placeholder='More Details' /></td>" +
        "<td><input style='width:150px' type='file' class='form-control' name='FPDD_PATH' id='FPDD_PATH" + ID + "' /></td>" +
        "<td><img src='/Assets/images/delete-btn.png' class='delete-btn' onclick='DeleteTblRecord(this)' /></td></tr>"
    )
}
function MedCatgryUniqueAdd(ID, name) {
    $("#tblMedCatgry tbody").append("<tr><td hidden><input class='form-control' name='DiseaseID' id='DiseaseID" + ID + "' value='" + ID + "' /></td>" +
        "<td><input style='width:280px' class='form-control readonly' name='DISEAESE_NAME' id='DISEAESE_NAME" + ID + "' value='" + name + "' readonly /></td>" +
        "<td><input style='width:150px' class='form-control' name='FCDS_DISEASE_DETAILS' id='FCDS_DISEASE_DETAILS" + ID + "' placeholder='More Details' /></td>" +
        "<td><input style='width:150px' type='file' class='form-control' name='FPDD_PATH' id='FPDD_PATH" + ID + "' /></td>" +
        "<td><img src='/Assets/images/delete-btn.png' class='delete-btn' onclick='DeleteTblRecord(this)' /></td></tr>"
    )
}
function selectOccup(CUOCP_ID) {
    $("#FCDM_OW_CUOCP_FSCD_ID").val(CUOCP_ID)
}