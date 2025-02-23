// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: Protos/reflection.proto
// </auto-generated>
#pragma warning disable 0414, 1591, 8981, 0612
#region Designer generated code

using grpc = global::Grpc.Core;

namespace ReflectionGrpcService {
  public static partial class Reflection
  {
    static readonly string __ServiceName = "Reflection";

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static void __Helper_SerializeMessage(global::Google.Protobuf.IMessage message, grpc::SerializationContext context)
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (message is global::Google.Protobuf.IBufferMessage)
      {
        context.SetPayloadLength(message.CalculateSize());
        global::Google.Protobuf.MessageExtensions.WriteTo(message, context.GetBufferWriter());
        context.Complete();
        return;
      }
      #endif
      context.Complete(global::Google.Protobuf.MessageExtensions.ToByteArray(message));
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static class __Helper_MessageCache<T>
    {
      public static readonly bool IsBufferMessage = global::System.Reflection.IntrospectionExtensions.GetTypeInfo(typeof(global::Google.Protobuf.IBufferMessage)).IsAssignableFrom(typeof(T));
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static T __Helper_DeserializeMessage<T>(grpc::DeserializationContext context, global::Google.Protobuf.MessageParser<T> parser) where T : global::Google.Protobuf.IMessage<T>
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (__Helper_MessageCache<T>.IsBufferMessage)
      {
        return parser.ParseFrom(context.PayloadAsReadOnlySequence());
      }
      #endif
      return parser.ParseFrom(context.PayloadAsNewBuffer());
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.GetReflectionQuestionsRequest> __Marshaller_GetReflectionQuestionsRequest = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.GetReflectionQuestionsRequest.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.GetReflectionQuestionsReply> __Marshaller_GetReflectionQuestionsReply = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.GetReflectionQuestionsReply.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdRequest> __Marshaller_GetReflectionAnswerByQuestionIdRequest = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdRequest.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdReply> __Marshaller_GetReflectionAnswerByQuestionIdReply = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdReply.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.PostReflectionQuestionRequest> __Marshaller_PostReflectionQuestionRequest = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.PostReflectionQuestionRequest.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.PostReflectionQuestionReply> __Marshaller_PostReflectionQuestionReply = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.PostReflectionQuestionReply.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.PostReflectionAnswerRequest> __Marshaller_PostReflectionAnswerRequest = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.PostReflectionAnswerRequest.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.PostReflectionAnswerReply> __Marshaller_PostReflectionAnswerReply = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.PostReflectionAnswerReply.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.UpdateReflectionQuestionActiveRequest> __Marshaller_UpdateReflectionQuestionActiveRequest = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.UpdateReflectionQuestionActiveRequest.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.UpdateReflectionQuestionActiveReply> __Marshaller_UpdateReflectionQuestionActiveReply = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.UpdateReflectionQuestionActiveReply.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.GetReflectionAnswersByDateRequest> __Marshaller_GetReflectionAnswersByDateRequest = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.GetReflectionAnswersByDateRequest.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::ReflectionGrpcService.GetReflectionAnswersByDateReply> __Marshaller_GetReflectionAnswersByDateReply = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::ReflectionGrpcService.GetReflectionAnswersByDateReply.Parser));

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::ReflectionGrpcService.GetReflectionQuestionsRequest, global::ReflectionGrpcService.GetReflectionQuestionsReply> __Method_GetReflectionQuestions = new grpc::Method<global::ReflectionGrpcService.GetReflectionQuestionsRequest, global::ReflectionGrpcService.GetReflectionQuestionsReply>(
        grpc::MethodType.Unary,
        __ServiceName,
        "GetReflectionQuestions",
        __Marshaller_GetReflectionQuestionsRequest,
        __Marshaller_GetReflectionQuestionsReply);

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdRequest, global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdReply> __Method_GetReflectionAnswerByQuestionId = new grpc::Method<global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdRequest, global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdReply>(
        grpc::MethodType.Unary,
        __ServiceName,
        "GetReflectionAnswerByQuestionId",
        __Marshaller_GetReflectionAnswerByQuestionIdRequest,
        __Marshaller_GetReflectionAnswerByQuestionIdReply);

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::ReflectionGrpcService.PostReflectionQuestionRequest, global::ReflectionGrpcService.PostReflectionQuestionReply> __Method_PostReflectionQuestion = new grpc::Method<global::ReflectionGrpcService.PostReflectionQuestionRequest, global::ReflectionGrpcService.PostReflectionQuestionReply>(
        grpc::MethodType.Unary,
        __ServiceName,
        "PostReflectionQuestion",
        __Marshaller_PostReflectionQuestionRequest,
        __Marshaller_PostReflectionQuestionReply);

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::ReflectionGrpcService.PostReflectionAnswerRequest, global::ReflectionGrpcService.PostReflectionAnswerReply> __Method_PostReflectionAnswer = new grpc::Method<global::ReflectionGrpcService.PostReflectionAnswerRequest, global::ReflectionGrpcService.PostReflectionAnswerReply>(
        grpc::MethodType.Unary,
        __ServiceName,
        "PostReflectionAnswer",
        __Marshaller_PostReflectionAnswerRequest,
        __Marshaller_PostReflectionAnswerReply);

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::ReflectionGrpcService.UpdateReflectionQuestionActiveRequest, global::ReflectionGrpcService.UpdateReflectionQuestionActiveReply> __Method_UpdateReflectionQuestionActiveStatus = new grpc::Method<global::ReflectionGrpcService.UpdateReflectionQuestionActiveRequest, global::ReflectionGrpcService.UpdateReflectionQuestionActiveReply>(
        grpc::MethodType.Unary,
        __ServiceName,
        "UpdateReflectionQuestionActiveStatus",
        __Marshaller_UpdateReflectionQuestionActiveRequest,
        __Marshaller_UpdateReflectionQuestionActiveReply);

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::ReflectionGrpcService.GetReflectionAnswersByDateRequest, global::ReflectionGrpcService.GetReflectionAnswersByDateReply> __Method_GetReflectionAnswersByDate = new grpc::Method<global::ReflectionGrpcService.GetReflectionAnswersByDateRequest, global::ReflectionGrpcService.GetReflectionAnswersByDateReply>(
        grpc::MethodType.Unary,
        __ServiceName,
        "GetReflectionAnswersByDate",
        __Marshaller_GetReflectionAnswersByDateRequest,
        __Marshaller_GetReflectionAnswersByDateReply);

    /// <summary>Service descriptor</summary>
    public static global::Google.Protobuf.Reflection.ServiceDescriptor Descriptor
    {
      get { return global::ReflectionGrpcService.ReflectionReflection.Descriptor.Services[0]; }
    }

    /// <summary>Base class for server-side implementations of Reflection</summary>
    [grpc::BindServiceMethod(typeof(Reflection), "BindService")]
    public abstract partial class ReflectionBase
    {
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::System.Threading.Tasks.Task<global::ReflectionGrpcService.GetReflectionQuestionsReply> GetReflectionQuestions(global::ReflectionGrpcService.GetReflectionQuestionsRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::System.Threading.Tasks.Task<global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdReply> GetReflectionAnswerByQuestionId(global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::System.Threading.Tasks.Task<global::ReflectionGrpcService.PostReflectionQuestionReply> PostReflectionQuestion(global::ReflectionGrpcService.PostReflectionQuestionRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::System.Threading.Tasks.Task<global::ReflectionGrpcService.PostReflectionAnswerReply> PostReflectionAnswer(global::ReflectionGrpcService.PostReflectionAnswerRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::System.Threading.Tasks.Task<global::ReflectionGrpcService.UpdateReflectionQuestionActiveReply> UpdateReflectionQuestionActiveStatus(global::ReflectionGrpcService.UpdateReflectionQuestionActiveRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::System.Threading.Tasks.Task<global::ReflectionGrpcService.GetReflectionAnswersByDateReply> GetReflectionAnswersByDate(global::ReflectionGrpcService.GetReflectionAnswersByDateRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

    }

    /// <summary>Creates service definition that can be registered with a server</summary>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    public static grpc::ServerServiceDefinition BindService(ReflectionBase serviceImpl)
    {
      return grpc::ServerServiceDefinition.CreateBuilder()
          .AddMethod(__Method_GetReflectionQuestions, serviceImpl.GetReflectionQuestions)
          .AddMethod(__Method_GetReflectionAnswerByQuestionId, serviceImpl.GetReflectionAnswerByQuestionId)
          .AddMethod(__Method_PostReflectionQuestion, serviceImpl.PostReflectionQuestion)
          .AddMethod(__Method_PostReflectionAnswer, serviceImpl.PostReflectionAnswer)
          .AddMethod(__Method_UpdateReflectionQuestionActiveStatus, serviceImpl.UpdateReflectionQuestionActiveStatus)
          .AddMethod(__Method_GetReflectionAnswersByDate, serviceImpl.GetReflectionAnswersByDate).Build();
    }

    /// <summary>Register service method with a service binder with or without implementation. Useful when customizing the service binding logic.
    /// Note: this method is part of an experimental API that can change or be removed without any prior notice.</summary>
    /// <param name="serviceBinder">Service methods will be bound by calling <c>AddMethod</c> on this object.</param>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    public static void BindService(grpc::ServiceBinderBase serviceBinder, ReflectionBase serviceImpl)
    {
      serviceBinder.AddMethod(__Method_GetReflectionQuestions, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::ReflectionGrpcService.GetReflectionQuestionsRequest, global::ReflectionGrpcService.GetReflectionQuestionsReply>(serviceImpl.GetReflectionQuestions));
      serviceBinder.AddMethod(__Method_GetReflectionAnswerByQuestionId, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdRequest, global::ReflectionGrpcService.GetReflectionAnswerByQuestionIdReply>(serviceImpl.GetReflectionAnswerByQuestionId));
      serviceBinder.AddMethod(__Method_PostReflectionQuestion, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::ReflectionGrpcService.PostReflectionQuestionRequest, global::ReflectionGrpcService.PostReflectionQuestionReply>(serviceImpl.PostReflectionQuestion));
      serviceBinder.AddMethod(__Method_PostReflectionAnswer, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::ReflectionGrpcService.PostReflectionAnswerRequest, global::ReflectionGrpcService.PostReflectionAnswerReply>(serviceImpl.PostReflectionAnswer));
      serviceBinder.AddMethod(__Method_UpdateReflectionQuestionActiveStatus, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::ReflectionGrpcService.UpdateReflectionQuestionActiveRequest, global::ReflectionGrpcService.UpdateReflectionQuestionActiveReply>(serviceImpl.UpdateReflectionQuestionActiveStatus));
      serviceBinder.AddMethod(__Method_GetReflectionAnswersByDate, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::ReflectionGrpcService.GetReflectionAnswersByDateRequest, global::ReflectionGrpcService.GetReflectionAnswersByDateReply>(serviceImpl.GetReflectionAnswersByDate));
    }

  }
}
#endregion
