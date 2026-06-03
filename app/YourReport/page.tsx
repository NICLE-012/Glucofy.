"use client";

import Sidebars from "../sidebar/page";
import { useEffect, useState } from "react";
import { Cell } from "recharts";
import { toast } from "sonner";

import {
    Clock3,
    AlertTriangle,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function ReportPage() {

    const [activeTab, setActiveTab] = useState("daily");
    const [filter, setFilter] = useState("Current Week");
    const [patternData, setPatternData] = useState<any>(null);
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchReportData = async (type: string) => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const now = new Date();

            const currentYear =
                now.getFullYear();

            let endpoint = "";
            let query = "";

            if (type === "daily") {

                endpoint = "daily";

                if (filter === "Current Week") {

                    const currentWeek =
                        Math.ceil(
                            now.getDate() / 7
                        );

                    query =
                        `?mode=week&year=${currentYear}&week=${currentWeek}`;

                } else {

                    const weekNumber =
                        filter.replace(
                            "Week ",
                            ""
                        );

                    query =
                        `?mode=week&year=${currentYear}&week=${weekNumber}`;
                }

            } else if (type === "week") {

                endpoint = "weekly";

                if (
                    filter === "Current Month"
                ) {

                    query = "?mode=all";

                } else {

                    const monthIndex = [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ].indexOf(filter) + 1;

                    query =
                        `?mode=month&year=${currentYear}&month=${monthIndex}`;
                }

            } else if (type === "month") {

                endpoint = "monthly";

                query =
                    `?mode=all&year=${filter}`;

            } else {

                endpoint = "yearly";

                query = "?mode=all";
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/nutrition/chart/${endpoint}${query}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            console.log(
                "Report:",
                data
            );

            setReportData(
                data.data || []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to load report data"
            );

        } finally {

            setLoading(false);

        }

    };

    const fetchPattern = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/nutrition/pattern`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            setPatternData(data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to load timing pattern"
            );

        }

    };

    useEffect(() => {

        fetchReportData(activeTab);

        fetchPattern();

    }, [activeTab, filter]);
    const chartData = (() => {

        if (activeTab === "week") {

            const weekMap = {
                W1: 0,
                W2: 0,
                W3: 0,
                W4: 0,
                W5: 0
            };

            reportData.forEach((item) => {

                const week =
                    item.week
                        ?.split("-")
                        ?.pop();

                if (
                    week &&
                    week in weekMap
                ) {
                    weekMap[
                        week as keyof typeof weekMap
                    ] = Number(
                        item.sugar || 0
                    );
                }

            });

            return Object.entries(
                weekMap
            ).map(
                ([label, value]) => ({
                    label,
                    value
                })
            );
        }

        return reportData.map((item) => {

            let label = "";

            if (activeTab === "daily") {

                const days = [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat"
                ];

                label =
                    days[
                    new Date(item.date)
                        .getDay()
                    ];

            } else if (
                activeTab === "month"
            ) {

                if (item.month) {

                    label =
                        new Date(
                            `${item.month}-01`
                        ).toLocaleDateString(
                            "en-US",
                            {
                                month: "short"
                            }
                        );

                }

            } else if (
                activeTab === "year"
            ) {

                label = item.year;

            }

            return {
                label,
                value: Number(
                    item.sugar || 0
                )
            };

        });

    })();

    const colors = [
        "#EFD547",
        "#56C000",
        "#56C000",
        "#98E24A",
        "#EFD547",
        "#F79431",
        "#EA580C",
    ];

    const highestPattern =
        patternData
            ? Object.entries(
                patternData
            ).sort(
                (a, b) =>
                    Number(b[1]) -
                    Number(a[1])
            )[0]
            : null;

    const limits = {
        daily: 175,
        week: 750,
        month: 9125,
        year: 109500
    };

    const totalSugar =
        reportData.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.sugar || 0
                ),
            0
        );

    const currentLimit =
        limits[
        activeTab as keyof typeof limits
        ] || 0;

    const exceeded =
        totalSugar -
        currentLimit;

    const isExceeded =
        exceeded > 0;

    const topEntries =
        [...chartData]
            .sort(
                (a, b) =>
                    Number(b.value) -
                    Number(a.value)
            )
            .slice(0, 2);




    const first =
        topEntries[0];

    const second =
        topEntries[1];

    const currentYearDisplay =
        new Date()
            .getFullYear();

    const years: string[] = [];

    for (
        let year = 2024;
        year <=
        currentYearDisplay;
        year++
    ) {
        years.push(
            year.toString()
        );
    }

    const filterOptions = {
        daily: [
            "Current Week",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 5"
        ],

        week: [
            "Current Month",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],

        month: years
    };
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebars />

            {/* CONTENT */}
            <main className="flex-1 p-8 lg:ml-[300px]">
                {/* HEADER */}
                <div className="mb-8">
                    <div className="flex justify-end md:justify-start">

                        <div>
                            <h1
                                className="
                text-3xl
                md:text-4xl
                lg:text-5xl
                font-bold
                text-right
                md:text-left
                "
                            >
                                Your Report
                            </h1>

                            <p
                                className="
                text-zinc-500
                mt-2
                text-right
                md:text-left
                "
                            >
                                Ringkasan konsumsi gula dan pola kamu
                            </p>
                        </div>

                    </div>
                </div>

                {/* TAB */}



                <div className="flex gap-3 mb-8">

                    <button
                        onClick={() => {
                            setActiveTab("daily");
                            setFilter("Current Week");
                        }}
                        className={`px-8 py-3 rounded-2xl font-semibold transition-all ${activeTab === "daily"
                            ? "bg-lime-500 text-white"
                            : "bg-white border"
                            }`}
                    >
                        Daily
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("week");
                            setFilter("Current Month");
                        }}
                        className={`px-8 py-3 rounded-2xl font-semibold transition-all ${activeTab === "week"
                            ? "bg-lime-500 text-white"
                            : "bg-white border"
                            }`}
                    >
                        Week
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("month");
                            setFilter(
                                new Date()
                                    .getFullYear()
                                    .toString()
                            );
                        }}
                        className={`px-8 py-3 rounded-2xl font-semibold transition-all ${activeTab === "month"
                            ? "bg-lime-500 text-white"
                            : "bg-white border"
                            }`}
                    >
                        Month
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("year");
                            setFilter("all");
                        }}
                        className={`px-8 py-3 rounded-2xl font-semibold transition-all ${activeTab === "year"
                            ? "bg-lime-500 text-white"
                            : "bg-white border"
                            }`}
                    >
                        Year
                    </button>
                </div>

                {/* FILTER */}
                {activeTab !== "year" && (
                    <div className="mb-8">
                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(e.target.value)
                            }
                            className="
                bg-white
                border
                border-gray-200
                rounded-xl
                px-4
                py-3
                font-medium
                shadow-sm
                min-w-[220px]
            "
                        >
                            {filterOptions[
                                activeTab as keyof typeof filterOptions
                            ]?.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">

                    {/* CHART */}
                    <section className="xl:col-span-12 bg-white rounded-3xl p-4 lg:p-8 shadow-sm">

                        <h2 className="text-xl lg:text-3xl font-bold mb-6">
                            Sugar Intake {
                                activeTab === "daily"
                                    ? "Per Day"
                                    : activeTab === "week"
                                        ? "Per Week"
                                        : activeTab === "month"
                                            ? "Per Month"
                                            : "Per Year"
                            }
                        </h2>

                        <div className="h-[280px] sm:h-[350px] lg:h-[500px] border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart data={chartData}>

                                    <XAxis dataKey="label" />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="value"
                                        radius={[10, 10, 0, 0]}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={
                                                    colors[
                                                    index %
                                                    colors.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Bar>

                                </BarChart>
                            </ResponsiveContainer>

                        </div>

                    </section>

                    {/* ALERT */}
                    <div className="col-span-1 lg:col-span-6 bg-white rounded-3xl p-5 lg:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <AlertTriangle className="text-orange-500" />
                            <h2 className="font-bold text-xl lg:text-3xl">
                                {activeTab === "week"
                                    ? "Weekly Alert"
                                    : activeTab === "month"
                                        ? "Monthly Alert"
                                        : "Yearly Alert"}
                            </h2>
                        </div>

                        <div className="flex flex-col justify-center h-[350px]">

                            <p className="text-gray-600 text-xl leading-relaxed mb-8">

                                {activeTab === "week"
                                    ? "Konsumsi tertinggi terjadi pada periode minggu ini."
                                    : activeTab === "month"
                                        ? "Konsumsi tertinggi terjadi pada periode bulan ini."
                                        : "Konsumsi tertinggi terjadi pada periode tahun ini."}

                            </p>

                            <div className="space-y-4">

                                <div className="
border
rounded-xl
p-4
flex
flex-col
sm:flex-row
sm:items-center
sm:justify-between
gap-3
">

                                    <div className="font-bold text-xl lg:text-3xl text-gray-700">
                                        {first?.label || "-"}
                                    </div>

                                    <div
                                        className="
    bg-red-100
    text-red-600
    px-6
    py-2
    rounded-full
    font-bold
    text-2xl
    "
                                    >
                                        {Math.round(first?.value || 0)}g
                                    </div>

                                    <div className="text-gray-500 font-semibold">
                                        Tertinggi
                                    </div>

                                </div>

                                <div className="
border
rounded-xl
p-4
flex
flex-col
sm:flex-row
sm:items-center
sm:justify-between
gap-3
">

                                    <div className="font-bold text-xl lg:text-3xl text-gray-700">
                                        {second?.label || "-"}
                                    </div>

                                    <div
                                        className="
        bg-orange-100
        text-orange-600
        px-6
        py-2
        rounded-full
        font-bold
        text-2xl
        "
                                    >
                                        {Math.round(second?.value || 0)}g
                                    </div>

                                    <div className="text-gray-500 font-semibold">
                                        Kedua
                                    </div>

                                </div>

                            </div>

                            <div className="mt-8">

                                <p
                                    className={`
            font-semibold
            ${isExceeded
                                            ? "text-red-500"
                                            : "text-green-600"
                                        }
        `}
                                >

                                    {isExceeded
                                        ? `⚠️ Melebihi batas sebesar ${Math.round(exceeded)}g`
                                        : `✅ Masih aman ${Math.round(Math.abs(exceeded))}g`}

                                </p>

                            </div>

                        </div>
                    </div>

                    {/* TIMING */}
                    <div className="col-span-1 lg:col-span-6 bg-white rounded-[32px] p-5 lg:p-8 shadow-lg">

                        <div className="flex items-center gap-3 mb-8">

                            <Clock3 className="text-blue-500" />

                            <h2 className="font-bold text-3xl">
                                Timing Pattern
                            </h2>

                        </div>

                        <div className="space-y-4">

                            {/* PAGI */}
                            <div
                                className="
            border
            border-gray-200
            rounded-2xl
            px-6
            py-5
            flex
            items-center
            justify-between
            shadow-sm
            hover:shadow-md
            transition-all
            "
                            >

                                <h3 className="font-bold text-xl">
                                    🌅 Pagi
                                </h3>

                                <p className="text-3xl font-bold text-blue-500">
                                    {patternData?.MORNING || 0}
                                </p>

                                <p className="text-blue-500 font-semibold">
                                    Aman
                                </p>

                            </div>

                            {/* SIANG */}
                            <div
                                className="
            border
            border-gray-200
            rounded-2xl
            px-6
            py-5
            flex
            items-center
            justify-between
            shadow-sm
            hover:shadow-md
            transition-all
            "
                            >

                                <h3 className="font-bold text-xl">
                                    ☀️ Siang
                                </h3>

                                <p className="text-3xl font-bold text-orange-500">
                                    {patternData?.AFTERNOON || 0}
                                </p>

                                <p className="text-orange-500 font-semibold">
                                    Normal
                                </p>

                            </div>

                            {/* MALAM */}
                            <div
                                className="
            border
            border-gray-200
            rounded-2xl
            px-6
            py-5
            flex
            items-center
            justify-between
            shadow-sm
            hover:shadow-md
            transition-all
            "
                            >

                                <h3 className="font-bold text-xl">
                                    🌙 Malam
                                </h3>

                                <p className="text-3xl font-bold text-red-500">
                                    {patternData?.NIGHT || 0}
                                </p>

                                <p className="text-red-500 font-semibold">
                                    Tinggi
                                </p>

                            </div>

                        </div>

                        <div className="bg-lime-100 rounded-2xl p-5 mt-6">

                            <p className="text-green-700 font-medium leading-relaxed">

                                Konsumsi tertinggi terjadi pada{" "}

                                <span className="font-bold">

                                    {highestPattern?.[0] === "MORNING"
                                        ? "pagi hari"
                                        : highestPattern?.[0] === "AFTERNOON"
                                            ? "siang hari"
                                            : highestPattern?.[0] === "EVENING"
                                                ? "sore hari"
                                                : "malam hari"}

                                </span>

                                . Coba kurangi konsumsi minuman manis pada waktu tersebut agar pola konsumsi lebih seimbang.

                            </p>

                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}


