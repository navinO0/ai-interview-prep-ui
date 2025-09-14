"use client";
import TruncatedMarkdown from "@/utils/truncatedMarkdown";
import * as Accordion from "@radix-ui/react-accordion";
import ReactMarkdown from "react-markdown";
import { ChevronDown } from "lucide-react";

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
      className="w-full bg-white rounded-2xl shadow-lg divide-y divide-gray-200 
                 sm:max-w-full md:max-w-3xl lg:max-w-5xl mx-auto overflow-hidden"
    >
      {data.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="border-b last:border-none"
        >
          <Accordion.Header>
            <Accordion.Trigger
              className="w-full flex justify-between text-left items-start px-5 py-4 
                         font-semibold text-gray-800 text-base sm:text-lg 
                         hover:bg-gray-100 transition-colors group"
            >
              <TruncatedMarkdown text={item.label} />
              <ChevronDown
                className="h-5 w-5 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content
            className="px-5 py-4 bg-gray-50 text-sm sm:text-base 
                       text-gray-700 leading-relaxed animate-accordion-down"
          >
            {item.children?.map((child) => (
              <div
                key={child.id}
                className="pl-4 border-l-2 border-blue-400/70 mb-3 last:mb-0"
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
