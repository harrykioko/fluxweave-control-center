
import { ExternalLink } from "lucide-react";
import type { Resource } from "../types";

interface ResourceDetailContentProps {
  resource: Resource;
}

export function ResourceDetailContent({ resource }: ResourceDetailContentProps) {
  const { type } = resource;
  
  return (
    <div className="space-y-4 mt-4">
      <p className="text-slate-600">{resource.description}</p>

      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        {type === "tool" && (
          <>
            {resource.pricing && (
              <div>
                <h4 className="font-medium text-slate-700">Pricing</h4>
                <p className="text-slate-600">{resource.pricing}</p>
              </div>
            )}
            {resource.category && (
              <div>
                <h4 className="font-medium text-slate-700">Category</h4>
                <p className="text-slate-600">{resource.category}</p>
              </div>
            )}
          </>
        )}

        {type === "read" && (
          <>
            {resource.author && (
              <div>
                <h4 className="font-medium text-slate-700">Author</h4>
                <p className="text-slate-600">{resource.author}</p>
              </div>
            )}
            {resource.category && (
              <div>
                <h4 className="font-medium text-slate-700">Category</h4>
                <p className="text-slate-600">{resource.category}</p>
              </div>
            )}
          </>
        )}

        {type === "subscription" && (
          <>
            <div>
              <h4 className="font-medium text-slate-700">Cost</h4>
              <p className="text-slate-600">
                {resource.price} 
                {resource.frequency && <span> ({resource.frequency})</span>}
              </p>
            </div>
            {resource.username && (
              <div>
                <h4 className="font-medium text-slate-700">Username</h4>
                <p className="text-slate-600">{resource.username}</p>
              </div>
            )}
            {resource.password && (
              <div>
                <h4 className="font-medium text-slate-700">Password</h4>
                <p className="text-slate-600">••••••••</p>
              </div>
            )}
          </>
        )}
      </div>

      {resource.link && (
        <div className="mt-6">
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-600 hover:text-purple-800"
          >
            Visit Resource
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}
