"use client";
import * as Accordion from "@radix-ui/react-accordion";
import ReactMarkdown from "react-markdown";

export default function HistoryCard({ history }) {
  const data = history || [
    {
      id: "1",
      label: "# History\nThis section stores your **interview attempts**.",
      children: [
        {
          id: "1.1",
          label:
            "### Session Management\nRedis is *faster* than Postgres for **sessions**.",
        },
        {
          id: "1.2",
          label: "### Leaderboards\nUse Redis **sorted sets** for ranking.",
        },
      ],
    },
  ];

  return (
    <Accordion.Root
      type="multiple"
      className="w-full h-full bg-white rounded-lg shadow divide-y divide-gray-200 
                 sm:max-w-full md:max-w-3xl lg:max-w-5xl mx-auto"
    >
      {data.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="border-b last:border-none"
        >
          <Accordion.Header className="bg-gray-100 hover:bg-gray-200 transition">
            <Accordion.Trigger className="w-full text-left px-4 py-3 font-semibold text-base sm:text-lg">
              <ReactMarkdown>{item.label}</ReactMarkdown>
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="px-4 py-3 space-y-2 bg-gray-50 text-sm sm:text-base">
            {item.children?.map((child) => (
              <div
                key={child.id}
                className="pl-4 border-l-2 border-gray-300"
              >
                <ReactMarkdown>{child.label}</ReactMarkdown>
              </div>
            ))}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
