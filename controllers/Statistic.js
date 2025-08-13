const Placement = require("../models/Placement");
const Student = require("../models/Student");

exports.getBranchWiseStudent = async (req, res) => {
  try {
    const result = await Student.aggregate([
        {
          $facet: {
            bySession: [
              {
                $group: {
                  _id: {
                    session: "$session",
                    branch: "$branch"
                  },
                  count: { $sum: 1 }
                }
              },
              {
                $lookup: {
                  from: "departments",
                  localField: "_id.branch",
                  foreignField: "_id",
                  as: "branchDetails"
                }
              },
              {
                $unwind: "$branchDetails"
              },
              {
                $group: {
                  _id: "$_id.session",
                  branches: {
                    $push: {
                      branchName: "$branchDetails.departmentAbbr", 
                      count: "$count"
                    }
                  }
                }
              },
              {
                $sort: {
                  _id: -1 // Sort by session in ascending order (use -1 for descending order)
                }
              },
              {
                $project: {
                  _id: 0,
                  session: "$_id",
                  branches: 1
                }
              }
            ],
            overall: [
              {
                $group: {
                  _id: "$branch",
                  count: { $sum: 1 }
                }
              },
              {
                $lookup: {
                  from: "departments",
                  localField: "_id",
                  foreignField: "_id",
                  as: "branchDetails"
                }
              },
              {
                $unwind: "$branchDetails"
              },
              {
                $project: {
                  _id: 0,
                  branchName: "$branchDetails.departmentAbbr", 
                  count: 1
                }
              },
              {
                $group: {
                  _id: null,
                  branches: {
                    $push: {
                      branchName: "$branchName", 
                      count: "$count"
                    }
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  session: "Overall",
                  branches: 1
                }
              }
            ]
          }
        },
        {
          $project: {
            result: {
              $concatArrays: [ "$overall","$bySession"]
            }
          }
        },
        {
          $unwind: "$result"
        },
        {
          $replaceRoot: {
            newRoot: "$result"
          }
        }
      ]);
    return res.status(200).json({
      success: true,
      message: "Student Statistics",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching statistics",
      error: error.message,
    });
  }
};

exports.getBranchWisePlacement = async (req, res) => {
    try {
      const result = await Placement.aggregate([
          {
            $facet: {
              bySession: [
                {
                  $group: {
                    _id: {
                      session: "$session",
                      branch: "$branch"
                    },
                    count: { $sum: 1 }
                  }
                },
                {
                  $lookup: {
                    from: "departments",
                    localField: "_id.branch",
                    foreignField: "_id",
                    as: "branchDetails"
                  }
                },
                {
                  $unwind: "$branchDetails"
                },
                {
                  $group: {
                    _id: "$_id.session",
                    branches: {
                      $push: {
                        branchName: "$branchDetails.departmentAbbr", 
                        count: "$count"
                      }
                    }
                  }
                },
                {
                  $sort: {
                    _id: -1 // Sort by session in ascending order (use -1 for descending order)
                  }
                },
                {
                  $project: {
                    _id: 0,
                    session: "$_id",
                    branches: 1
                  }
                }
              ],
              overall: [
                {
                  $group: {
                    _id: "$branch",
                    count: { $sum: 1 }
                  }
                },
                {
                  $lookup: {
                    from: "departments",
                    localField: "_id",
                    foreignField: "_id",
                    as: "branchDetails"
                  }
                },
                {
                  $unwind: "$branchDetails"
                },
                {
                  $project: {
                    _id: 0,
                    branchName: "$branchDetails.departmentAbbr", 
                    count: 1
                  }
                },
                {
                  $group: {
                    _id: null,
                    branches: {
                      $push: {
                        branchName: "$branchName", 
                        count: "$count"
                      }
                    }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    session: "Overall",
                    branches: 1
                  }
                }
              ]
            }
          },
          {
            $project: {
              result: {
                $concatArrays: [ "$overall","$bySession"]
              }
            }
          },
          {
            $unwind: "$result"
          },
          {
            $replaceRoot: {
              newRoot: "$result"
            }
          }
        ]);
      return res.status(200).json({
        success: true,
        message: "Student Statistics",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error while fetching statistics",
        error: error.message,
      });
    }
  };